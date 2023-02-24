# TODO at v0.1.0

Want to rewrite the parser using compilation principles, nouns and conventions are expected to follow ahk-v1-doc

## ahk-v1-doc

<https://www.autohotkey.com/docs/v1/Concepts.htm#control-flo>

## [Control Flow](https://www.autohotkey.com/docs/v1/Concepts.htm#control-flow)

_Control flow_ is the order in which individual statements are executed. Normally statements are executed sequentially from top to bottom, but a control flow statement can override this, such as by specifying that statements should be executed repeatedly, or only if a certain condition is met.

Statement

A _statement_ is simply the smallest standalone element of the language that expresses some action to be carried out. In AutoHotkey, statements include commands, assignments, function calls and other expressions. However, directives, labels (including hotkeys and hotstrings), and declarations without assignments are not statements; they are processed when the program first starts up, before the script _executes_.

Execute

Carry out, perform, evaluate, put into effect, etc. _Execute_ basically has the same meaning as in non-programming speak.

Body

The _body_ of a control flow statement is the statement or group of statements to which it applies. For example, the body of an [if statement](https://www.autohotkey.com/docs/v1/Language.htm#if-statement) is executed only if a specific condition is met.

if all files not changed

| ms       | 0.0.23    | 0.0.24b | x   |
| -------- | --------- | ------- | --- |
| 88-files | 1600~1800 | 450~500 | 3X  |
| 29-files | 700~800   | 50~80   | 10X |

if all files changed

| ms       | 0.0.23    | 0.0.24b   | x  |
| -------- | --------- | --------- | -- |
| 88-files | 1600~1800 | 1600~1800 | 1X |
| 29-files | 700~800   | 700~800   | 1X |
