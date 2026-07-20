# SNS 컨셉 기반 NestJS 프로젝트

## 진행 상황 (2026-07-18 기준)

### 완료된 기능

- 회원가입/로그인 (JWT access/refresh 토큰)
- Passport 기반 (JwtAccessStrategy, JwtRefreshStrategy, Guard)
- Users CRUD, 커스텀 @User() 데코레이터
- Posts CRUD + Pagination (Page/cursor 방식)
- Posts 생성 시 트랜잭션 적용 (TransactionInterceptor)
- WebSocket 기반 실시간 채팅 (연결 인증, 채팅방 생성/입장, 메시지 송수신)

### 남은 작업

- [ ] post 수정/삭제에도 트랜잭션 적용 검토
- [ ] 본인 게시글만 수정/삭제 가능하도록 권한 검증 로직 추가
- [ ] RoleGuard 적용

### 잠시 중단

해당 프로젝트를 진행하기 앞서 조금더 깊이 있는 백엔드 서버 개발자가 되기 위해 Java/Spring 학습으로 우선순위 이동. 핵심 기능은 구현 및 테스트 완료 된 상태 입니다.
