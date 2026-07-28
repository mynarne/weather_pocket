# Weather Pocket

## 배포 URL
> https://weatherpocket.vercel.app

## GitHub Repository
> https://github.com/mynarne/weather_pocket

## 프로젝트 소개
Weather Pocket은 대한민국 전국 17개 시·도(서울특별시, 광역시, 특별자치시 및 도 단위 대표 관측 도시)의 현재 날씨와 7일간의 주간 예보를 조회하고, 관심 지역을 저장 및 로컬 검색할 수 있는 Next.js 기반 날씨 웹 애플리케이션입니다.

## 선택한 플랫폼
- Responsive Web Application
- Next.js App Router (v16.2.12)
- TypeScript

## 실행 방법

### 패키지 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속합니다.

### 정적 분석, 테스트 및 프로덕션 빌드
```bash
# ESLint 정적 분석
npm run lint

# Vitest 단위 테스트 실행
npm run test

# 프로덕션 빌드 검증
npm run build
```

## 주요 기능
1. **전국 17개 시·도 날씨 조회 (`/`)**
   - 전국 17개 시·도의 현재 기온, 습도, 날씨 상태, 관측 기준 시각 표시
   - 도 단위 지역(경기도, 강원특별자치도 등)은 대표 관측 도시(수원, 춘천 등) 기준 좌표를 명시하여 표시
   - 카드 내 주간 예보 보기 링크 제공

2. **지역명 검색 및 필터링**
   - 정식 지역명(예: "서울특별시"), 축약명("서울"), 대표 도시명("수원", "청주") 기반 로컬 실시간 검색
   - 전체 지역 / 관심 지역 모아보기 필터 제공 (검색어와 필터 동시 적용)
   - 등록된 관심 지역이나 검색 결과가 없을 때 각각 전용 안내 뷰 표시

3. **도시 상세 주간 예보 (`/cities/[cityId]`)**
   - 선택한 지역의 현재 날씨 요약 및 7일간 일별 예보 목록 제공
   - `generateStaticParams()`를 통해 17개 정적 라우트 사전 빌드(SSG) 지원
   - 유효하지 않은 도시 ID 접근 시 Next.js `notFound()` 기반 404 화면 처리

4. **관심 지역 저장**
   - 별(★/☆) 버튼을 통한 관심 지역 등록 및 해제
   - Zustand persist 미들웨어를 이용해 `localStorage`에 상태 영속화
   - 복원 전 서버/클라이언트 출력 차이를 방지하는 렌더링 처리 적용

5. **다중 좌표 API 요청 최적화 및 예보 데이터 결합**
   - Open-Meteo Forecast API의 다중 위도/경도(comma-separated) 요청을 활용하여 단 1번의 HTTP 통신으로 17개 지역 데이터를 효율적으로 페칭 (실패 시 개별 `Promise.allSettled` 폴백)
   - Open-Meteo API에서 제공되지 않는 일별 습도를 `hourly` 상대습도 데이터 기반 일평균(`Math.round`)으로 계산하여 주간 예보 데이터와 결합

## 기술 스택
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (+ persist middleware)
- **API**: Open-Meteo Forecast API
- **Date Utility**: date-fns
- **Test**: Vitest (17개 단위 테스트 통과)
- **Deploy**: Vercel

## 폴더 구조
```
src/
├── app/
│   ├── cities/
│   │   └── [cityId]/
│   │       ├── error.tsx
│   │       ├── loading.tsx
│   │       ├── not-found.tsx
│   │       └── page.tsx
│   ├── error.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   └── page.tsx
│
├── components/
│   ├── city/
│   │   ├── CityCard.tsx
│   │   ├── CityList.tsx
│   │   ├── CityListFilter.tsx
│   │   ├── CitySearchInput.tsx
│   │   └── FavoriteButton.tsx
│   │
│   ├── forecast/
│   │   ├── CurrentWeatherSummary.tsx
│   │   ├── ForecastItem.tsx
│   │   └── ForecastList.tsx
│   │
│   └── common/
│       ├── EmptyState.tsx
│       ├── ErrorMessage.tsx
│       ├── Header.tsx
│       └── LoadingSkeleton.tsx
│
├── constants/
│   ├── cities.ts
│   └── weather.ts
│
├── lib/
│   ├── api/
│   │   └── openMeteo.ts
│   ├── hooks/
│   │   └── useIsMounted.ts
│   ├── mappers/
│   │   └── weatherMapper.ts
│   └── utils/
│       ├── calculateDailyHumidity.ts
│       ├── filterCities.ts
│       ├── formatDate.ts
│       └── formatWeatherTime.ts
│
├── stores/
│   └── favoriteStore.ts
│
├── types/
│   ├── city.ts
│   └── weather.ts
│
└── tests/
    ├── calculateDailyHumidity.test.ts
    ├── cities.test.ts
    ├── filterCities.test.ts
    └── weatherMapper.test.ts
```

## 설계 의도

### 컴포넌트 구조
역할에 따라 컴포넌트를 분리했습니다. UI 컴포넌트는 API 접근 책임을 직접 가지지 않고 Props로 전달받은 데이터 도메인 객체를 출력하며, 사용자의 액션 이벤트를 전달받아 처리합니다.

### 상태 관리
사용자의 관심 지역 ID 목록(`favoriteCityIds: string[]`)만 Zustand 스토어로 관리하며, persist 미들웨어를 통해 `localStorage`('weather-pocket-favorites' 키)에 저장합니다. 도시의 전체 객체가 아닌 최소 ID 단위만 저장하여 저장 공간과 관리를 단순화했습니다.

### 데이터 매핑 (Mapper)
Open-Meteo API의 원본 snake_case 응답 객체(`temperature_2m`, `relative_humidity_2m` 등)는 `src/lib/mappers/weatherMapper.ts`를 거쳐 UI 전용 도메인 모델(`CurrentWeather`, `DailyForecast`)로 변환되어 전달됩니다. 이를 통해 컴포넌트가 외부 API 데이터 필드명에 직접 의존하지 않도록 분리했습니다.

### Server Component와 Client Component 분리
- **Server Component (`page.tsx`, `ForecastList` 등)**: 초기 데이터 조회를 서버에서 처리하고 클라이언트 JavaScript 번들 범위를 줄이기 위해 사용했습니다.
- **Client Component (`CityList`, `FavoriteButton`, `CityListFilter`, `CitySearchInput` 등)**: 이벤트 처리, 브라우저 마운트 여부 확인, Zustand 전역 상태 접근이 필요한 최소 범위에만 `"use client"`를 선언했습니다. (`CityCard`는 `"use client"`인 `CityList` 내부에서 import되므로 클라이언트 번들 경계에 포함됩니다.)

## Open-Meteo API 처리

### 현재 날씨 페칭 및 캐싱
`getAllCitiesWeather` 함수에서 Open-Meteo의 다중 좌표 요청 기능을 사용하여 단 1번의 HTTP 통신으로 17개 지역 데이터를 효율적으로 페칭합니다. Open-Meteo 요청에 15분 단위 데이터 재검증(`next: { revalidate: 900 }`) 설정을 적용했습니다. 현재 날씨 데이터의 특성과 과도한 API 호출 방지를 고려하여 15분 재검증 주기를 선택했습니다.

### 주간 예보 및 일평균 습도 계산
Open-Meteo의 `daily` 응답에는 일별 상대습도가 직접 제공되지 않아 `hourly.relative_humidity_2m` 및 `hourly.time` 데이터를 함께 가져옵니다. `calculateDailyHumidity` 순수 함수를 통해 날짜별(YYYY-MM-DD)로 그룹화하여 일평균 습도를 계산(`Math.round`)한 뒤 주간 예보 데이터와 결합합니다.

### 날씨 코드 매핑 및 폴백
`WEATHER_STATUS` 매핑 테이블을 구축하여 WMO weather_code 숫자값을 한국어 라벨("맑음", "흐림", "강한 비" 등)과 이모지 아이콘(☀️, ☁️, 🌧️ 등)으로 변환합니다. 정의되지 않은 코드가 전달되는 경우 `UNKNOWN_WEATHER`("정보 없음", ❓) 폴백 처리를 적용했습니다.

### 오류 처리
- **다중 지역 요청**: 다중 좌표 요청 시 예외가 발생하면 차선책으로 개별 `Promise.allSettled` 요청으로 전환하여 일부 지역 요청이 실패하더라도 성공한 지역 데이터가 표시되도록 구성했습니다.
- **상세 라우트 요청**: 상세 페이지 데이터 요청 실패 시 Next.js `error.tsx` 에러 바운더리로 전환하여 재시도를 유도합니다.

## 테스트
Vitest를 활용하여 도메인 계산, 필터링 및 매핑 순수 함수에 대한 17개 단위 테스트를 수행합니다.
```bash
npm run test
```
- `cities.test.ts`: 17개 시·도 데이터 유효성, ID 중복 여부, 도 단위 대표 도시 명시 여부 및 `findCityById` 검증
- `filterCities.test.ts`: 지역명/축약명/대표도시명 검색, 대소문자/공백 처리, 관심 지역 필터와 검색어 조합 동작 검증
- `calculateDailyHumidity.test.ts`: 날짜별 습도 평균 계산, 여러 날짜 분리, 빈 배열 및 NaN 처리 검증
- `weatherMapper.test.ts`: 날씨 코드 매핑(0: 맑음, 999: 정보 없음) 및 원본 응답 도메인 모델 매핑 검증

## AI 도구 사용 내역
- 프로젝트 구조 검토, 타입 정의 초안 작성 및 Vitest 테스트 케이스 아이디어 도출에 AI 보조 도구를 활용했습니다.
- AI 도구가 제시한 코드는 Open-Meteo 실제 API 응답 대조, TypeScript 컴파일 검사, ESLint 정적 분석, 단위 테스트 검증 및 Next.js 프로덕션 빌드를 통해 검증 및 수정하였습니다.
