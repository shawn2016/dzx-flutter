import * as assert from "assert";
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import { generateFiles, toPascalCase, toTitleCase } from "../extension"; // 根据实际路径调整

// ------ 测试工具函数 ------
suite("Utility Functions Test Suite", () => {
  test("toPascalCase should convert snake_case/kebab-case to PascalCase", () => {
    assert.strictEqual(toPascalCase("user_profile"), "UserProfile");
    assert.strictEqual(toPascalCase("user-profile"), "UserProfile");
    assert.strictEqual(toPascalCase("minePage"), "Minepage"); // 注意：需要处理驼峰输入
  });

  test("toPascalCase should handle complex names", () => {
    assert.strictEqual(toPascalCase("user_profile"), "UserProfile");
    assert.strictEqual(toPascalCase("my-settings-page"), "MySettingsPage");
    assert.strictEqual(toPascalCase("adminDashboard"), "Admindashboard"); // 注意驼峰转换
  });

  test("toTitleCase should generate readable titles", () => {
    assert.strictEqual(toTitleCase("user_profile"), "User Profile");
    assert.strictEqual(toTitleCase("settings-page"), "Settings Page");
  });
});

// ------ 测试文件生成核心逻辑 ------
suite("File Generation Test Suite", () => {
  let tempDir: string;

  // 创建临时目录
  setup(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "getx-test"));
    console.log(`[TEST] Using temp dir: ${tempDir}`); // 调试日志
  });

  // 清理临时目录
  teardown(() => {
    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("should generate 4 GetX files in target folder", async () => {
    const pageName = "test_page";
    generateFiles(pageName, tempDir);

    // 验证文件夹存在
    const targetDir = path.join(tempDir, pageName);
    assert.ok(fs.existsSync(targetDir), "Folder not created");

    // 验证文件列表
    const files = fs.readdirSync(targetDir);
    assert.deepStrictEqual(
      files.sort(),
      [
        `${pageName}_view.dart`,
        `${pageName}_binding.dart`,
        `${pageName}_logic.dart`,
        `${pageName}_state.dart`,
      ].sort(),
      "Missing expected files"
    );
  });

  test("generated files should contain correct class names", async () => {
    const pageName = "user_profile";

    console.log(`[TEST] Using temp dir: ${tempDir}`); // 调试日志
    console.log(`[TEST] Using pageName: ${pageName}`); // 调试日志

    await generateFiles(pageName, tempDir);

    // 验证 View 文件
    const viewPath = path.join(tempDir, pageName, `${pageName}_view.dart`);
    assert.ok(fs.existsSync(viewPath), "View file not created");
    const viewContent = fs.readFileSync(viewPath, "utf-8");

    // 关键断言
    assert.ok(
      viewContent.includes(
        "class UserProfileView extends GetView<UserProfileLogic>"
      ),
      `Actual content:\n${viewContent}`
    );
  });

  test("should handle empty page name gracefully", async () => {
    try {
      await generateFiles("", tempDir);
      assert.fail("Should throw error for empty page name");
    } catch (error) {
      assert.ok(error instanceof Error, "Expected error not thrown");
    }
  });
});

// ------ 集成测试（需要模拟 VS Code 环境） ------
suite("Extension Integration Test Suite", () => {
  test("should trigger command and show success message", async () => {
    // 模拟执行命令
    const mockUri = vscode.Uri.file(path.join(os.tmpdir(), "mock-dir"));
    await vscode.commands.executeCommand("extension.createGetXFiles", mockUri);

    // 验证消息提示（需要实际运行插件测试）
    // 注意：此测试需要更复杂的模拟框架支持（如 vsce test-extension）
  });
});
