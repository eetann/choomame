# テスト

## 状態遷移表

縦軸に状態、横軸にイベントとして押したボタンを書いている。  
「−」はそのボタンを押すといくつかのパラメータのみを維持し、余計なパラメータを削除したURLに遷移する。
状態そのものは変わらない。

|                  | Times(Any) | Times(Any以外)   | Languages(Any) | Languages(Any以外) |
|------------------|------------|------------------|----------------|--------------------|
| 未指定           | −          | 期間指定中       | −              | 言語指定中         |
| 期間指定中       | 未指定     | 期間指定中       | −              | 期間と言語指定中   |
| 言語指定中       | −          | 期間と言語指定中 | 未指定         | 言語指定中         |
| 期間と言語指定中 | 言語指定中 | 期間と言語指定中 | 期間指定中     | 期間と言語指定中   |


## 状態遷移図

<details>
<summary>
期間ボタンを押したときの状態遷移図
</summary>
```mermaid
stateDiagram-v2
  state "未指定" as Normal
  state "期間指定中" as Times
  state "言語指定中" as Languages
  state "期間と言語指定中" as TnL
  [*] --> Normal : 検索する
  Normal --> Times: Any以外
  Normal --> Normal: Any
  Times --> Times: Any以外
  Times --> Normal: Any
  Languages --> Languages: Any
  Languages --> TnL: Any以外
  TnL --> Languages: Any
```
</details>

<details>
<summary>
言語ボタンを押したときの状態遷移図
</summary>
```mermaid
stateDiagram-v2
  state "未指定" as Normal
  state "期間指定中" as Times
  state "言語指定中" as Languages
  state "期間と言語指定中" as TnL
  [*] --> Normal : 検索する
  Normal --> Languages: Any以外
  Normal --> Normal: Any
  Times --> TnL: Any以外
  Times --> Times: Any
  Languages --> Languages: Any以外
  Languages --> Normal: Any
  TnL --> Times: Any
```
</details>
