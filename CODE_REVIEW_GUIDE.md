# Weather Pocket - 코드 리뷰 & 기술 대비 가이드

이 문서는 **Weather Pocket** 프로젝트의 구조, 파일별 역할, 데이터 흐름 및 기술 인터뷰 대비 Q&A를 정리한 개발자용 리뷰 가이드입니다.

---

## 1. 전체 실행 흐름

### 1.1 전국 17개 시·도 목록 화면 실행 흐름 (`/`)
1. **[Server] `app/page.tsx` 진입**: 서버 사이드에서 `getAllCitiesWeather()` 함수 호출.
2. **[Server] `lib/api/openMeteo.ts`**: `CITIES` 17개 지역의 위도/경도를 쉼표로 연결하여 단 1번의 다중 좌표 Open-Meteo API 호출. 15분(`revalidate: 900`) 데이터 재검증 설정 적용. (비정상 시 `Promise.allSettled` 폴백)
3. **[Server] `lib/mappers/weatherMapper.ts`**: 성공한 응답 항목을 `mapCurrentWeather`를 통해 `CurrentWeather` 타입으로 변환.
4. **[Server -> Client] HTML 전달**: `CityWeather[]` 배열을 `CityList` 컴포넌트로 전달하여 초기 HTML 생성.
5. **[Client] `components/city/CityList.tsx`**: `useFavoriteStore`에서 관심 지역 ID 목록을 읽고, `useIsMounted`로 복원 시점 차이를 확인한 뒤 `filterCities` 순수 함수를 호출.
6. **[Client] 로컬 검색 및 필터 적용**: 사용자의 검색어 입력(`searchQuery`)과 선택 필터('all' | 'favorite')를 조합하여 `CityCard` 리스트 렌더링.

### 1.2 도시 상세 화면 실행 흐름 (`/cities/[cityId]`)
1. **[Server] `app/cities/[cityId]/page.tsx` 진입**: `generateStaticParams()`로 17개 라우트가 사전 정적 빌드(SSG)되어 제공되며, 비동기 `params` 수신 (`await params`).
2. **[Server] `constants/cities.ts`**: `findCityById(cityId)`를 통해 지역 검증. 미존재 ID 접근 시 `notFound()` 트리거 -> `not-found.tsx` 출력.
3. **[Server] `lib/api/openMeteo.ts`**: `getCityForecast(city)` 호출. Open-Meteo 상세 API 요청 (current, daily, hourly).
4. **[Server] `lib/utils/calculateDailyHumidity.ts`**: `hourly.time`과 `hourly.relative_humidity_2m`을 받아 날짜별 일평균 습도(`Math.round`) 계산.
5. **[Server] `lib/mappers/weatherMapper.ts`**: `mapCurrentWeather` 및 `mapDailyForecast`로 매핑하여 `CityForecast` 생성.
6. **[Server -> Client] UI 출력**: `CurrentWeatherSummary` 및 `ForecastList` 컴포넌트로 전달하여 화면 출력.

### 1.3 관심 지역(즐겨찾기) 상태 흐름
1. **[Client] 별 버튼 클릭**: 사용자가 `FavoriteButton` 클릭.
2. **[Client] `FavoriteButton.tsx`**: `e.preventDefault()`와 `e.stopPropagation()`을 호출하여 부모 라우팅 전파 방지 후 `toggleFavorite(cityId)` 실행.
3. **[Client] `stores/favoriteStore.ts`**: Zustand 스토어의 `favoriteCityIds` 배열에서 해당 ID를 추가 또는 제거.
4. **[Client] `persist` Middleware**: 변경된 `favoriteCityIds`를 `localStorage` ('weather-pocket-favorites' 키)에 저장.
5. **[Client] UI 동기화**: `useFavoriteStore`를 구독 중인 `CityList` 및 `FavoriteButton`이 반응하여 리렌더링.

---

## 2. 주요 파일별 책임 및 역할

| 파일 경로 | 파일 역할 | 주요 함수 / 컴포넌트 | 입력 / 반환 | 위치 선정 이유 | 에러 처리 방식 |
|---|---|---|---|---|---|
| `constants/cities.ts` | 전국 17개 시·도 정적 데이터 정의 | `CITIES`, `findCityById()` | `cityId: string` -> `City \| undefined` | 전국 17개 시·도 및 도 단위 대표 관측 도시 좌표를 단일 원천으로 보관 | 검색 실패 시 `undefined` 반환 |
| `constants/weather.ts` | WMO weather_code와 한글/이모지 매핑 | `WEATHER_STATUS`, `getWeatherStatus()` | `code: number` -> `WeatherStatus` | API 코드값과 UI 한국어/이모지 표현의 분리 | 미정의 코드 수신 시 `UNKNOWN_WEATHER` 반환 |
| `lib/api/openMeteo.ts` | Open-Meteo API 페칭 담당 | `getCurrentWeather()`, `getAllCitiesWeather()`, `getCityForecast()` | `City` -> `Promise<CurrentWeather / CityWeather[] / CityForecast>` | API 통신 로직을 별도 모듈로 분리 | 1차 다중 페칭 실패 시 2차 개별 `Promise.allSettled` 폴백 실행 |
| `lib/mappers/weatherMapper.ts` | 원본 API 응답을 화면용 도메인 타입으로 변환 | `mapCurrentWeather()`, `mapDailyForecast()` | `OpenMeteoResponse` -> `CurrentWeather / DailyForecast[]` | UI 컴포넌트가 외부 API 필드명에 의존하지 않도록 분리 | 습도 데이터 부재 시 `null` 반환 |
| `lib/utils/calculateDailyHumidity.ts` | hourly 습도를 날짜별 일평균으로 계산 | `calculateDailyHumidity()` | `times: string[], humidities: number[]` -> `Record<string, number>` | API/UI와 독립된 순수 계산 로직 | 배열의 짧은 길이를 기준으로 안전하게 순회, NaN 제외 |
| `lib/utils/filterCities.ts` | 지역명/축약명/대표도시명 및 관심 필터 결합 | `filterCities()` | `citiesWeather, filter, validFavoriteIds, searchQuery` -> `CityWeather[]` | 검색/필터 조합 로직을 순수 함수로 분리하여 테스트 가능하도록 위치 | 검색 결과 0개 시 빈 배열 반환 |
| `lib/hooks/useIsMounted.ts` | SSR/CSR 마운트 여부 확인 | `useIsMounted()` | 없음 -> `boolean` | Zustand persist 출력 차이를 완화하기 위해 위치 | SSR 시 `false`, 마운트 후 `true` 반환 |
| `stores/favoriteStore.ts` | 관심 지역 ID 전역 상태 관리 및 영속화 | `useFavoriteStore` | `cityId` -> `boolean / void` | 클라이언트 전용 관심 지역 ID 관리 | 유효하지 않은 ID 수신 시 `CityList`에서 상수의 도시 목록과 교집합 검증 |
| `components/city/CityCard.tsx` | 개별 지역 날씨 카드 표상 컴포넌트 | `CityCard` | `cityWeather: CityWeather` | `CityList`("use client") 내부에서 호출되어 클라이언트 번들 경계에 포함됨 | `error: true` 시 카드 내 부분 에러 메시지 출력 |
| `components/city/CitySearchInput.tsx` | 로컬 검색어 입력 인터페이스 | `CitySearchInput` | `searchQuery, onSearchChange` | 실시간 검색어 입력 UI 분리 | 검색어 지우기(✕) 버튼 제공 |

---

## 3. 코드 리뷰 핵심 Q&A (25선)

### Q1. 왜 Next.js와 App Router를 선택했나요?
**A:** React와 TypeScript 경험을 활용하면서, App Router의 Server Component를 통해 초기 데이터 조회를 서버에서 처리하고 클라이언트 JavaScript 번들 범위를 줄일 수 있기 때문입니다. 또한 Vercel에서 간단히 배포 가능한 장점이 있습니다.

### Q2. 왜 Zustand를 선택했나요? Context API 대신 사용한 이유가 무엇인가요?
**A:** Context API로도 충분히 구현할 수 있지만, 이 프로젝트에서는 여러 컴포넌트가 관심 도시 상태를 선택적으로 구독하고 localStorage 영속화까지 필요했습니다. Zustand가 Provider 구성 없이 상태 접근이 가능하고 persist middleware를 제공해 더 적은 코드로 요구사항을 선언적으로 표현할 수 있어 선택했습니다.

### Q3. 왜 날씨 데이터를 Zustand에 저장하지 않았나요?
**A:** 날씨 데이터는 외부 서버에서 가져오는 '서버 상태(Server State)'이고, 관심 지역은 사용자가 조작하는 '클라이언트 상태(Client State)'입니다. 역할에 따라 분리하여, 날씨 데이터는 Server Component에서 페칭하고 클라이언트 전역 상태에는 관심 지역 ID만 저장했습니다.

### Q4. 왜 API 응답 타입과 화면용 타입을 분리(mapper 사용)했나요?
**A:** API 원본 snake_case 응답 구조(`temperature_2m` 등)에 컴포넌트가 직접 의존하면 외부 API 변경 시 UI 전체 영향이 생깁니다. Mapper를 통해 화면용 타입(`CurrentWeather`, `DailyForecast`)으로 변환하여 컴포넌트가 외부 API 필드명에 직접 의존하지 않도록 분리했습니다.

### Q5. 7일 예보 습도 데이터는 어떻게 계산했나요?
**A:** Open-Meteo의 `daily` 응답에는 일별 상대습도가 직접 제공되지 않아 `hourly.relative_humidity_2m` 및 `hourly.time` 데이터를 함께 요청했습니다. `calculateDailyHumidity` 순수 함수에서 시간 데이터를 날짜별(YYYY-MM-DD)로 그룹화하여 일평균으로 계산(`Math.round`)한 후 주간 예보 데이터와 결합했습니다.

### Q6. 17개 지역 날씨를 가져올 때 API 요청 수와 성능 관리는 어떻게 했나요?
**A:** Open-Meteo Forecast API의 다중 위도/경도(comma-separated) 요청 기능을 활용하여 메인 페이지 진입 시 단 1번의 HTTP 통신으로 17개 지역 데이터를 한꺼번에 페칭했습니다. 네트워크 이상 시 차선책으로 개별 `Promise.allSettled` 요청으로 전환하는 폴백을 구비했습니다.

### Q7. Server Component와 Client Component의 구분 기준은 무엇인가요?
**A:** 초기 데이터 조회를 서버에서 처리하고 클라이언트 번들 범위를 축소하기 위해 `page.tsx` 등을 Server Component로 유지했습니다. 사용자 이벤트 처리(`onClick`), React 상태(`useState`), Zustand 접근이 필요한 범위(`CityList`, `FavoriteButton`, `CityListFilter`, `CitySearchInput`)에만 `"use client"`를 선언했습니다.

### Q8. `CityCard` 컴포넌트는 Server Component인가요?
**A:** `CityCard.tsx` 파일 자체에는 `"use client"` 지시어가 없지만, `"use client"`가 선언된 `CityList.tsx` 내부에서 직접 import되어 사용되므로 실질적으로 클라이언트 번들 경계(Client Boundary) 안에서 렌더링되는 표상(Presentational) 컴포넌트로 동작합니다.

### Q9. 관심 지역이 새로고침 후에도 유지되는 원리는 무엇인가요?
**A:** Zustand의 `persist` 미들웨어가 스토어 상태 변경 시 'weather-pocket-favorites' 키로 `localStorage`에 자동 보관하고, 초기 마운트 시 읽어와 복원해주기 때문입니다.

### Q10. persist 사용 시 Hydration Mismatch는 어떻게 대처했나요?
**A:** Zustand persist 상태가 복원되기 전 서버와 클라이언트의 출력 차이를 줄이기 위해 `useSyncExternalStore` 기반의 `useIsMounted` 커스텀 훅을 통해 마운트 여부를 확인하는 처리를 적용했습니다.

### Q11. 도시 전체 객체가 아니라 ID만 저장한 이유가 무엇인가요?
**A:** 도시 정식 명칭이나 좌표 정보가 업데이트되더라도 저장소 데이터와 충돌을 방지하고, 저장 데이터 용량을 최소화하기 위해 ID(`string[]`)만 저장했습니다.

### Q12. 잘못된 도시 ID가 localStorage에 남아있을 때는 어떻게 처리하나요?
**A:** `CityList` 컴포넌트에서 스토어 ID를 읽을 때 `CITIES` 상수의 도시 목록에 실제 존재하는 ID만 교집합으로 필터링(`CITIES.some(...)`)하도록 안전장치를 뒀습니다.

### Q13. 15분(`revalidate: 900`) 재검증 주기를 선택한 이유는 무엇인가요?
**A:** 현재 날씨 데이터의 특성과 과도한 API 호출 방지를 고려하여 Open-Meteo 요청에 15분 단위 데이터 재검증 설정을 적용했습니다.

### Q14. 존재하지 않는 도시 URL(`/cities/unknown`)로 접근하면 어떻게 처리되나요?
**A:** `src/app/cities/[cityId]/page.tsx`에서 `findCityById` 결과가 `undefined`이면 Next.js의 `notFound()` 함수를 트리거하여 전용 404 UI(`not-found.tsx`)를 출력합니다.

### Q15. 목록 화면과 상세 화면의 에러 처리 방식 차이는 무엇인가요?
**A:** 목록 화면은 다중 요청 폴백 및 카드 단위 부분 에러 UI를 노출하여 정상 지역 출력을 유지합니다. 반면 상세 화면은 단일 지역 데이터가 핵심이므로 실패 시 `error.tsx` 에러 바운더리로 전환하여 다시 시도를 유도합니다.

### Q16. `calculateDailyHumidity`에서 날짜 추출 방식은 무엇인가요?
**A:** API 요청 시 `timezone=Asia/Seoul`을 지정하여 시간 문자열이 한국 로컬 시간대이므로, 문자열의 앞 10자리(`time.slice(0, 10)`)를 잘라 날짜 키(YYYY-MM-DD)로 그룹화했습니다.

### Q17. 시간 배열과 습도 배열의 길이가 다르면 어떻게 되나요?
**A:** `calculateDailyHumidity` 함수에서 `Math.min(times.length, humidities.length)` 기준까지만 순회하여 배열 범위를 벗어나는 오류를 방지했습니다.

### Q18. 비정상적인 습도 값(NaN)이 들어오면 어떻게 되나요?
**A:** `typeof humidityVal === 'number' && !isNaN(humidityVal)` 조건으로 사전 검증하여 정상 숫자만 합산 및 평균 계산에 포함시켰습니다.

### Q19. 알 수 없는 `weather_code`가 들어오면 어떻게 처리되나요?
**A:** `getWeatherStatus` 함수에서 매핑 테이블에 없는 코드 수신 시 `UNKNOWN_WEATHER`("정보 없음", ❓) 폴백을 반환합니다.

### Q20. 단위 테스트 대상으로 무엇을 검증했나요?
**A:** 부작용이 없는 순수 함수(`calculateDailyHumidity`, `filterCities`, `weatherMapper`, `cities.ts` 정적 데이터 유효성)에 대한 17개 단위 테스트를 수행했습니다.

### Q21. 별 버튼 클릭 시 주간 예보 상세 페이지 이동이 발생하지 않게 한 방법은 무엇인가요?
**A:** `FavoriteButton` 핸들러에서 `e.preventDefault()`와 `e.stopPropagation()`을 호출하여 부모 이벤트 전파와 기본 동작을 방지했습니다. 또한 `<Link>` 태그 내부에 버튼을 중첩하지 않는 독립 마크업 구조를 유지했습니다.

### Q22. 접근성을 고려한 UI 요소는 무엇이 있나요?
**A:** 별 버튼에 `aria-label`("서울특별시 관심 도시 추가/해제")을 명시하고, 필터 버튼에는 `aria-pressed` 상태를 적용했으며, 키보드 포커스 링(`focus:ring-2`) 및 대소문자/공백 제거 검색을 제공합니다.

### Q23. 최근 관측 시각 포맷팅 방식은 무엇인가요?
**A:** `formatWeatherTime` 유틸리티 함수를 사용해 ISO 시간 문자열에서 시(Hour) 단위를 추출하여 "18시 기준" 형태로 포맷팅했습니다.

### Q24. AI 도구를 어떻게 활용하고 검증했나요?
**A:** 구조 검토 및 Vitest 테스트 케이스 아이디어 도출에 참고용으로 활용했으며, 제시된 코드는 Open-Meteo 실제 API 응답 대조, TypeScript 컴파일 검사, ESLint 정적 분석, 17개 단위 테스트 통과 및 Next.js 프로덕션 빌드를 통해 직접 검증 및 수정하였습니다.

### Q25. 이 프로젝트의 향후 확장 가능한 방향은 무엇인가요?
**A:** Open-Meteo Geocoding API를 연동한 실시간 장소 검색 확장, 브라우저 위치 권한 기반 현 위치 자동 추천, 그리고 주간/시간별 날씨 데이터 추이 차트 시각화 등이 확장 가능한 방향입니다.
