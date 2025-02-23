/*
 * @Date: 2025-02-23 12:24:12
 * @LastEditors: shawn
 * @LastEditTime: 2025-02-23 21:13:30
 */
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

// 定义模板类型
type TemplateType = "view" | "binding" | "logic" | "state";

// 注册命令
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.createGetXFiles",
    async (uri: vscode.Uri) => {
      // 获取用户输入的页面名称（如 "mine"）
      const pageName = await vscode.window.showInputBox({
        prompt:
          '输入页面名称（如 "mine"）,mine文件夹将生成mine_view.dart等文件',
        validateInput: value => (value ? null : "页面名称不能为空!"),
      });

      if (!pageName || !uri.fsPath) {
        return;
      }

      // 生成文件
      generateFiles(pageName, uri.fsPath);
    }
  );

  context.subscriptions.push(disposable);
}

// 完整模板函数实现（基于 extension.ts）
function getLogicTemplate(pageName: string): string {
  const className = toPascalCase(pageName); // 处理 user_profile → UserProfile
  const stateClassName = `${className}State`;
  return `import 'package:get/get.dart';
import '${pageName}_state.dart';

class ${className}Logic extends GetxController {
  final ${stateClassName} state = ${stateClassName}();

  @override
  void onReady() {
    // TODO: implement onReady
    super.onReady();
  }

  @override
  void onClose() {
    // TODO: implement onClose
    super.onClose();
  }
}
`;
}

function getStateTemplate(pageName: string): string {
  const className = toPascalCase(pageName);
  return `
class ${className}State {
  ${className}State() {
    ///Initialize variables
  }
}
`;
}

// ---------- 工具函数 ----------
// 转换为帕斯卡命名（处理下划线和连字符）
export function toPascalCase(str: string): string {
  return str
    .split(/[_-]/g) // 添加全局匹配标识
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

// 转换为可读标题（用于注释等）
export function toTitleCase(str: string): string {
  return str
    .split(/[_-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// 生成 GetX 文件
export function generateFiles(pageName: string, targetPath: string) {
  const templates: { [key in TemplateType]: string } = {
    view: getViewTemplate(pageName),
    binding: getBindingTemplate(pageName),
    logic: getLogicTemplate(pageName),
    state: getStateTemplate(pageName),
  };

  // 创建页面文件夹
  const folderPath = path.join(targetPath, pageName);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  // 写入文件
  Object.entries(templates).forEach(([type, content]) => {
    const fileName = `${pageName}_${type}.dart`;
    const filePath = path.join(folderPath, fileName);
    fs.writeFileSync(filePath, content);
  });

  vscode.window.showInformationMessage("GetX files created!");
}

// ---------- 模板定义 ----------
function getViewTemplate(pageName: string): string {
  const className = capitalize(pageName);
  console.log(className);
  return `import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '${pageName}_logic.dart';

class ${className}View extends GetView<${className}Logic> {
  const ${className}View({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('${toTitleCase(pageName)}')),
      body: const Center(child: Text('${className} View')),
    );
  }
}
`;
}

function getBindingTemplate(pageName: string): string {
  const className = capitalize(pageName);
  return `import 'package:get/get.dart';
import '${pageName}_logic.dart';

class ${className}Binding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => ${className}Logic());
  }
}
`;
}

// ... 同理实现 getLogicTemplate 和 getStateTemplate

// 工具函数：首字母大写并将下划线去掉后改成驼峰写法
function capitalize(str: string): string {
  //   return str.charAt(0).toUpperCase() + str.slice(1);
  return str
    .split(/[_-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}
