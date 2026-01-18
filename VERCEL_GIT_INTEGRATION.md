# Vercel GitHub 통합 설정 가이드

## 🔍 문제 진단

GitHub에 푸시했지만 Vercel에서 자동 배포가 트리거되지 않는 경우, 다음을 확인하세요.

## ✅ 해결 방법

### 방법 1: Vercel 프로젝트 재연결 (가장 확실한 방법)

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard

2. **프로젝트 선택**
   - Eighternity 프로젝트 클릭

3. **Settings > Git**
   - 좌측 메뉴에서 **Settings** 클릭
   - **Git** 섹션 클릭

4. **연결 확인**
   - **Production Branch**: `main`으로 설정되어 있는지 확인
   - **Repository**: `jame3gcp/Eighternity`로 연결되어 있는지 확인

5. **재연결 (필요한 경우)**
   - **Disconnect** 클릭
   - **Connect Git Repository** 클릭
   - GitHub 저장소 선택: `jame3gcp/Eighternity`
   - **Import** 클릭

### 방법 2: 수동 배포 (즉시 배포)

1. **Vercel 대시보드 > Deployments**
2. **최신 배포** 클릭
3. 우측 상단 **"..."** 메뉴 클릭
4. **Redeploy** 선택
5. **Use existing Build Cache** 체크 해제 (선택사항)
6. **Redeploy** 클릭

### 방법 3: GitHub Webhook 확인

1. **GitHub 저장소 설정**
   - GitHub 저장소 > **Settings** > **Webhooks**
   - Vercel webhook이 있는지 확인
   - URL: `https://api.vercel.com/v1/integrations/deploy/...`

2. **Webhook이 없는 경우**
   - Vercel에서 프로젝트를 재연결하면 자동 생성됨

### 방법 4: Vercel CLI로 배포

터미널에서:

```bash
# Vercel CLI 설치 (없는 경우)
npm i -g vercel

# 프로젝트 디렉토리에서
cd /Users/wilhigh/Eighternity

# Vercel 로그인
vercel login

# 배포
vercel --prod
```

## 🔧 자동 배포 설정 확인

### Vercel 프로젝트 설정

1. **Settings > Git**
   - ✅ **Production Branch**: `main`
   - ✅ **Auto-deploy from Git**: 활성화되어 있는지 확인

2. **Settings > General**
   - ✅ **Framework Preset**: Next.js
   - ✅ **Root Directory**: `./` (프로젝트 루트)

### GitHub 저장소 권한

1. **GitHub 저장소 > Settings > Collaborators**
   - Vercel 앱이 저장소에 접근 권한이 있는지 확인

2. **GitHub App 권한 확인**
   - GitHub > Settings > Applications > Installed GitHub Apps
   - Vercel 앱이 설치되어 있는지 확인

## 🚀 즉시 해결 (권장)

### 가장 빠른 방법:

1. **Vercel 대시보드 접속**
2. **프로젝트 선택**
3. **Deployments 탭**
4. **"..." 메뉴 > Redeploy** 클릭

이렇게 하면 즉시 재배포됩니다.

## 🔄 자동 배포 활성화

### 1. Vercel 프로젝트 설정

```
Settings > Git > Production Branch: main
Settings > Git > Auto-deploy from Git: ✅ Enabled
```

### 2. GitHub Webhook 확인

```
GitHub Repository > Settings > Webhooks
- Vercel webhook이 있는지 확인
- 최근 배송(Deliveries)에서 성공 여부 확인
```

### 3. 테스트

```bash
# 작은 변경사항 커밋
echo "# Test" >> README.md
git add README.md
git commit -m "Test auto-deploy"
git push
```

Vercel 대시보드에서 자동으로 새 배포가 시작되는지 확인하세요.

## 🐛 문제 해결

### 문제 1: "No deployments found"

**해결:**
- Vercel 프로젝트가 GitHub와 연결되지 않음
- 방법 1 참고하여 재연결

### 문제 2: Webhook이 실패함

**해결:**
- GitHub 저장소 권한 확인
- Vercel 앱 권한 확인
- Webhook 재생성 (프로젝트 재연결)

### 문제 3: 특정 브랜치만 배포됨

**해결:**
- Settings > Git > Production Branch 확인
- 원하는 브랜치로 변경

## 📝 체크리스트

배포 전 확인:

- [ ] Vercel 프로젝트가 GitHub 저장소와 연결되어 있음
- [ ] Production Branch가 올바르게 설정됨
- [ ] Auto-deploy가 활성화되어 있음
- [ ] GitHub Webhook이 정상 작동함
- [ ] Vercel 환경 변수가 설정되어 있음

## 💡 팁

- **수동 배포**: 즉시 배포가 필요한 경우 "Redeploy" 사용
- **자동 배포**: GitHub에 push하면 자동으로 배포됨
- **Preview 배포**: Pull Request 생성 시 자동으로 Preview 배포됨
