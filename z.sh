#!/bin/bash

FILE="/Users/wookhuh/Desktop/project/hyundai/202601_hec_CPO_MVP/keycloakify-starter-main/src/login/assets/images/login-logo.svg"
TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJaR01SUHI5QVg2d2FaWGVfWVNvNkh2SUp2UHA4UGd0ZmpwRHo2TjFEVUxZIn0.eyJleHAiOjE3ODc2MzgwMTIsImlhdCI6MTc4NzYzNjgxMiwiYXV0aF90aW1lIjoxNzg3NjM2MDY4LCJqdGkiOiJvbnJ0cnQ6NDQ3OGQ3ZDQtYTkxMS04ZTA3LTJmYzEtZThkYTNjYzQxYzRmIiwiaXNzIjoiaHR0cHM6Ly9kZXYtYXV0aC5lLWNtcC5jby5rci9hdXRoL3JlYWxtcy9lY21wIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjIwMTM2MGFiLTE4OWItNGUwMC05ZTcyLWU5NTE0YjM0MDQ0ZCIsInR5cCI6IkJlYXJlciIsImF6cCI6ImJvLXdlYmFwcCIsInNpZCI6Im5IMFM0di1ScmpIbFdtRUlHWlpIRXZuVCIsImFjciI6IjAiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9kZXYtZW1zcC5lLWNtcC5jby5rciIsImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMSIsImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJkZWZhdWx0LXJvbGVzLWVjbXAiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6Iu2XiOyasSIsImNvbXBhbnkiOiJIRUMiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiIyNjA4NzA4QGhlYy1wYXJ0bmVyLmNvLmtyIiwiZGVwYXJ0bWVudCI6Iu2YkeugpeyCrCIsImVtYWlsIjoiMjYwODcwOEBoZWMtcGFydG5lci5jby5rciJ9.LdPgoGOM_KnVcjvdLJ0dgMRh6IC7SPdXu6bcJPhR6wu-eKZqKWxpakgM3eGAphrGsLAlmWeGxS-RhnYJm7ViXyDA94F9YuUD91c6UZWBUi9l9iqNYRC4lvgVBRj46XjyTV8INKjfn-FsrBmYdBLDNUdRRTgXBJf6fjfoxdCZXHzpBr2Lj74yW77YrkVhb2MhMmSs1cheJgBdBympXLHqEvTbXnUAJPeoIa3VTUNZUInLv4ZO_4aEo8Jn6K3zIOAh1NKdKdcfmK_RLH_LtTJvUk2EL92I1f9hDiMWbhlL7E8-V3lzY9uxbl1Lz1zdiEUSAIEKp6f9QZfwuSNFsZvrWg"

API_URL="https://dev-emspapi.e-cmp.co.kr/v1/backoffice/files/multiple/upload/urls"

FILE_NAME=$(basename "$FILE")
FILE_SIZE=$(stat -f%z "$FILE")
CONTENT_TYPE="image/svg+xml"

echo "파일명: $FILE_NAME"
echo "파일크기: $FILE_SIZE bytes"

# 1. 서명 Upload URL 발급
RESPONSE=$(curl --silent --show-error --fail-with-body \
  --request POST \
  --url "$API_URL" \
  --header "Authorization: Bearer ${TOKEN}" \
  --header "Content-Type: application/json;charset=UTF-8" \
  --data "[
    {
      \"referenceType\": \"BOARD\",
      \"originalName\": \"${FILE_NAME}\",
      \"contentType\": \"${CONTENT_TYPE}\",
      \"fileSize\": ${FILE_SIZE}
    }
  ]"
)

echo "서명 URL 발급 응답:"
echo "$RESPONSE" | jq .

# API 결과 코드 확인
CODE=$(echo "$RESPONSE" | jq -r '.code')

if [ "$CODE" != "0000" ]; then
  echo "서명 URL 발급 API 실패"
  exit 1
fi

# 응답 데이터 추출
FILE_DTL_ID=$(echo "$RESPONSE" | jq -r '.data[0].fileDtlId')
UPLOAD_URL=$(echo "$RESPONSE" | jq -r '.data[0].uploadUrl')
DOWNLOAD_URL=$(echo "$RESPONSE" | jq -r '.data[0].downloadUrl')

echo
echo "fileDtlId: $FILE_DTL_ID"
echo "uploadUrl: $UPLOAD_URL"
echo "downloadUrl: $DOWNLOAD_URL"

if [ -z "$UPLOAD_URL" ] || [ "$UPLOAD_URL" = "null" ]; then
  echo "uploadUrl 발급 실패"
  exit 1
fi

# 2. 실제 파일 업로드
echo
echo "파일 업로드 시작..."

curl --show-error --fail-with-body \
  --request PUT \
  --url "$UPLOAD_URL" \
  --header "Content-Type: application/octet-stream" \
  --data-binary "@${FILE}"

echo
echo "파일 업로드 완료"
echo "fileDtlId: $FILE_DTL_ID"
