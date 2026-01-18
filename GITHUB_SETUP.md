# GitHub 저장소 설정 가이드

## 📋 현재 상태

- ✅ Git 저장소 초기화 완료
- ✅ .gitignore 설정 완료
- ✅ README.md 생성 완료
- ⏳ 파일 스테이징 및 커밋 대기 중

## 🚀 GitHub에 Push하는 방법

### 방법 1: GitHub 웹에서 새 저장소 생성 후 Push

#### 1단계: GitHub에서 새 저장소 생성

1. GitHub.com 접속
2. 우측 상단 **"+"** 버튼 클릭 → **"New repository"** 선택
3. 저장소 정보 입력:
   - **Repository name**: `Eighternity` (또는 원하는 이름)
   - **Description**: "사주 기반 하이브리드 추천 시스템"
   - **Visibility**: Public 또는 Private 선택
   - ⚠️ **"Initialize this repository with a README" 체크하지 마세요** (이미 로컬에 있음)
4. **"Create repository"** 클릭

#### 2단계: 로컬에서 커밋 및 Push

터미널에서 다음 명령어 실행:

```bash
# 1. 초기 커밋 생성
git commit -m "Initial commit: Saju MVP with Supabase integration"

# 2. GitHub 원격 저장소 추가 (YOUR_USERNAME을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/Eighternity.git

# 3. 기본 브랜치를 main으로 설정
git branch -M main

# 4. GitHub에 Push
git push -u origin main
```

### 방법 2: GitHub CLI 사용 (gh 설치된 경우)

```bash
# GitHub CLI로 저장소 생성 및 Push
gh repo create Eighternity --public --source=. --remote=origin --push
```

## 🔐 인증 설정

### Personal Access Token 사용 (권장)

1. GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. **"Generate new token"** 클릭
3. 권한 선택:
   - ✅ `repo` (전체 저장소 접근)
4. 토큰 생성 후 복사
5. Push 시 비밀번호 대신 토큰 사용

### SSH 키 사용

```bash
# SSH 키가 있다면
git remote set-url origin git@github.com:YOUR_USERNAME/Eighternity.git
git push -u origin main
```

## ✅ Push 완료 확인

GitHub 저장소 페이지에서 다음을 확인:
- ✅ 모든 파일이 업로드되었는지
- ✅ README.md가 표시되는지
- ✅ .gitignore가 적용되어 있는지 (node_modules 등이 보이지 않아야 함)

## 🔄 이후 작업

### 일반적인 Git 워크플로우

```bash
# 변경사항 확인
git status

# 변경사항 스테이징
git add .

# 커밋
git commit -m "커밋 메시지"

# Push
git push
```

### 브랜치 관리

```bash
# 새 기능 브랜치 생성
git checkout -b feature/new-feature

# 작업 후 커밋 및 Push
git push -u origin feature/new-feature

# GitHub에서 Pull Request 생성
```

## ⚠️ 주의사항

1. **환경 변수 파일은 절대 커밋하지 마세요**
   - `.env.local`은 이미 .gitignore에 포함됨
   - 확인: `git status`에서 .env.local이 나타나지 않아야 함

2. **민감한 정보 확인**
   - Service Role Key가 코드에 하드코딩되지 않았는지 확인
   - Supabase URL/Key가 코드에 노출되지 않았는지 확인

3. **대용량 파일**
   - `.next/` 폴더는 빌드 결과물이므로 .gitignore에 포함됨
   - `node_modules/`도 포함됨

## 🐛 문제 해결

### 오류: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/Eighternity.git
```

### 오류: "Authentication failed"
- Personal Access Token 사용 확인
- 또는 SSH 키 설정 확인

### 오류: "Permission denied"
- 저장소 접근 권한 확인
- GitHub 계정 확인
