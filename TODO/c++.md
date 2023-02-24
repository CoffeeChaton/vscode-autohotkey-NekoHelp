# It is expected to build a more appropriate language service based on the source code

<https://github.com/Lexikos/AutoHotkey_L>

```c++
class Line
{
private:
 ResultType EvaluateCondition();
```

```c++
////////////////////////////////////////////////////////////////////////////////////////
// Do some special preparsing of the MsgBox command, since it is so frequently used and
// it is also the source of problem areas going from AutoIt2 to 3 and also due to the
// new numeric parameter at the end.  Whenever possible, we want to avoid the need for
// the user to have to escape commas that are intended to be literal.
///////////////////////////////////////////////////////////////////////////////////////
int max_params_override = 0; // Set default.
if (aActionType == ACT_MSGBOX)
```

```c++
case ACT_MSGBOX:
{
  int result;
  HWND dialog_owner = THREAD_DIALOG_OWNER; // Resolve macro only once to reduce code size.
  //...
}
```

```c++
// Parse the parameter string into a list of separate params.
```

```c++
int FindNextDelimiter(LPCTSTR aBuf, TCHAR aDelimiter, int aStartIndex, LPCTSTR aLiteralMap)
```

```c++
Func *Script::FindFuncInLibrary(LPTSTR aFuncName, size_t aFuncNameLength, bool &aErrorWasShown, bool &aFileWasFound, bool aIsAutoInclude)
```

```c++
if (   !(pfunc = AddFunc(func_name, aFuncNameLength, true, left))   ) // L27:
```

```c++
ResultType Script::AddLine(ActionTypeType aActionType, LPTSTR aArg[], int aArgc, LPTSTR aArgMap[])
```

```c++
if (g_Warn_Unreachable)
switch (line->mActionType)
{
case ACT_RETURN:
case ACT_BREAK:
case ACT_CONTINUE:
case ACT_GOTO:
case ACT_THROW:
case ACT_EXIT:
```

```c++
Line *Script::PreparseBlocks(Line *aStartingLine, ExecUntilMode aMode, Line *aParentLine, const AttributeType aLoopType)

PreparseError(_T("Expected Case/Default"));
```

```c++
 case ACT_ASSIGN:
  // Note: This line's args have not yet been dereferenced in this case (i.e. ExpandArgs() hasn't been
  // called).  The below function will handle that if it is needed.
  return PerformAssign();  // It will report any errors for us.

 case ACT_ASSIGNEXPR:
```

```c++
Var *Script::FindOrAddVar(LPTSTR aVarName, size_t aVarNameLength, int aScope)
```

```c++
// Declare built-in var read function.
 #define BIV_DECL_R(name) VarSizeType name(LPTSTR aBuf, LPTSTR aVarName)
```
