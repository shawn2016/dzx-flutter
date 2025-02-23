<!--
 * @Date: 2025-02-23 12:24:12
 * @LastEditors: shawn
 * @LastEditTime: 2025-02-24 07:38:09
-->

# [zx] Flutter GetX 文件生成工具

![VSIX Version](https://img.shields.io/badge/version-0.0.2-blue)
![VSCode Version](https://img.shields.io/badge/vscode-%3E%3D1.97.0-brightgreen)

用于快速生成 Flutter GetX 架构所需的 view/binding/logic/state 文件，提升开发效率。

## ✨ 功能特性

- 右键菜单快速生成 GetX 四件套文件
- 自动创建页面文件夹
- 符合 Dart 命名规范（帕斯卡命名法）
- 生成基础模板代码

## 🚀 使用指南

1. 在项目目录的 `lib` 文件夹中：

   - 右键点击目标目录
   - 选择 `新建一个dart页面`

2. 输入页面名称（例如：`user_profile`）
   - 自动生成小写文件夹（`user_profile`）
   - 生成四个标准文件：
     - user_profile_view.dart
     - user_profile_binding.dart
     - user_profile_logic.dart
     - user_profile_state.dart

## 📁 文件结构

生成后的文件结构示例：

    lib/
    └── modules/
    └── user_profile/
    ├── user_profile_view.dart # 页面视图
    ├── user_profile_binding.dart # 依赖绑定
    ├── user_profile_logic.dart # 业务逻辑
    └── user_profile_state.dart # 状态管

## 📝 代码结构示例

### View 文件模板

```dart
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'user_profile_logic.dart';

class UserProfilePage extends GetView<UserProfileLogic> {
  const UserProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('UserProfile Page')),
      body: const Center(child: Text('UserProfile Page')),
    );
  }
}

```

### Logic 文件示例

```dart
import 'package:get/get.dart';
import 'user_profile_state.dart';

class UserProfileLogic extends GetxController {
  final state = UserProfileState();

  // 生命周期函数
  @override
  void onInit() {
    super.onInit();
    // 初始化逻辑
  }

  @override
  void onClose() {
    // 清理逻辑
    super.onClose();
  }

}

```

### State 文件示例

```dart
import 'package:get/get.dart';

class UserProfileState {
UserProfileState() {
    ///Initialize variables
  }
}
```

### Binding 文件示例

```dart
import 'package:get/get.dart';
import 'user_profile_logic.dart';

class UserProfileBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => UserProfileLogic());
  }
}

```

## ⚠️ 注意事项

1. 确保在有效的 Dart 项目中使用
2. 页面名称建议使用小写字母和下划线组合（如 `my_page`）
3. 自动转换命名：
   - 输入 `user_profile` → 类名 `UserProfile`
   - 输入 `home` → 类名 `Home`

## 🤝 参与贡献

欢迎提交 Issue 或 PR：

1. Fork 本仓库
2. 创建特性分支（`git checkout -b feature/xxx`）
3. 提交修改（`git commit -m 'Add some feature'`）
4. 推送分支（`git push origin feature/xxx`）
5. 新建 Pull Request

---

**Happy Coding!** 🎉 如果遇到问题，请提交 Issue 或在 VSCode 扩展面板提交反馈。
