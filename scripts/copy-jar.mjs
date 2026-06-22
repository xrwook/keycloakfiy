import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Keycloakify로 빌드된 JAR 파일을 providers 디렉토리로 복사하고 버전을 업데이트하는 스크립트
 */
try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // 디렉토리 경로 설정
  const distDir = path.join(__dirname, "..", "dist_keycloak");
  const providerDir = path.join(__dirname, "..", "providers");
  const packageJsonPath = path.join(__dirname, "..", "package.json");

  // package.json 버전 업데이트
  const packageJsonData = fs.readFileSync(packageJsonPath, "utf8");
  const packageJson = JSON.parse(packageJsonData);

  // 현재 버전 파싱
  const currentVersion = packageJson.version;

  // 버전 업데이트 (패치 버전 증가: 0.0.0 -> 0.0.1)
  const versionParts = currentVersion.split(".");
  versionParts[2] = parseInt(versionParts[2]) + 1; // 패치 버전 증가
  const newVersion = versionParts.join(".");
  packageJson.version = newVersion;

  // 업데이트된 package.json 저장
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n", "utf8");
  console.log(`Version updated: ${currentVersion} -> ${newVersion}`);

  // 2. providers 디렉토리 존재 확인 및 생성
  if (!fs.existsSync(providerDir)) {
    fs.mkdirSync(providerDir, { recursive: true });
  }

  // 3. dist_keycloak 디렉토리 존재 확인
  if (!fs.existsSync(distDir)) {
    throw new Error(
      `Build directory not found: ${distDir}. Please run 'npx keycloakify build' first.`
    );
  }

  // 4. JAR 파일 찾기
  const files = fs.readdirSync(distDir);
  const jarFiles = files.filter(file => file.endsWith(".jar"));

  if (jarFiles.length === 0) {
    throw new Error("No JAR files found in dist_keycloak directory.");
  }

  // 최신 JAR 파일 선택 (수정 날짜 기준)
  let latestJarFile = jarFiles[0];
  let latestTime = 0;

  for (const file of jarFiles) {
    const filePath = path.join(distDir, file);
    const stats = fs.statSync(filePath);
    if (stats.mtimeMs > latestTime) {
      latestTime = stats.mtimeMs;
      latestJarFile = file;
    }
  }

  // 5. JAR 파일 복사 (버전 포함)
  const sourcePath = path.join(distDir, latestJarFile);
  const targetFileName = `cpos-login-theme_v${newVersion}.jar`;
  const targetPath = path.join(providerDir, targetFileName);

  // 기존 버전 JAR 파일 정리 (동일한 패턴의 파일 모두 삭제)
  const existingFiles = fs.readdirSync(providerDir);
  const oldThemeFiles = existingFiles.filter(
    file => file.startsWith("cpos-login-theme_v") && file.endsWith(".jar")
  );

  for (const oldFile of oldThemeFiles) {
    const oldFilePath = path.join(providerDir, oldFile);
    fs.unlinkSync(oldFilePath);
  }

  // 새 버전 파일 복사
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`providers/${targetFileName}`);
} catch (error) {
  console.error(`Error: ${error.message}`);
}
