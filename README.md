# JAEBC.com

Official website of **JAEBC — Japan-Africa Entertainment Business Council**
（日本アフリカエンタメ事業協議会 / ジェイビース）

> 日本とアフリカのエンターテインメント産業（音楽・映像・アニメ・漫画・ゲーム・スポーツエンタメ・ファッション等）を結び、
> 持続的な事業創出と戦略的投資を促進する非営利プラットフォーム。

## About JAEBC

- **設立**: 2025年10月30日
- **ローンチイベント**: 2025年11月10日（渋谷・約80名参加）
- **運営事務局**: 株式会社ステージバンク / Stagebank, Inc.
- **日本拠点**: 東京都千代田区丸の内2丁目3番2号4階
- **アフリカ拠点**: 10 Agodogba Avenue, Ikoyi, Lagos, Nigeria
- **Contact**: info@jaebc.org

## スタック

- 静的サイト（HTML / CSS / Vanilla JS・依存ゼロ）
- ホスティング: **Cloudflare Pages**
- ソース管理: **GitHub**
- フォント: Google Fonts (Inter + Noto Sans JP)

## ファイル構成

```
.
├── index.html          # サイト本体（1ページ構成・タブ付き）
├── logo.png            # JAEBC公式ロゴ（改変禁止）
├── _headers            # Cloudflare Pages 用ヘッダー設定
├── robots.txt          # SEO
├── sitemap.xml         # SEO
├── README.md           # このファイル
└── DEPLOY-GUIDE.md     # 公開手順書（日本語）
```

## サイト構成（セクション）

1. Hero — 協議会のメインメッセージ
2. About / 設立背景
3. Activities / 活動内容（News Letter、Biz Trip、Event、Executive Briefing）
4. Updates / お知らせ（ニュース と マンスリーレター をタブ切替）
5. Founders / 発起人・運営幹事
6. Partners / 現地パートナー
7. Founders' Message / 発起人の思い
8. Contact / 入会案内

## ローカルで確認

`index.html` をダブルクリックでブラウザに開くだけで確認できます。

## デプロイ

`DEPLOY-GUIDE.md` を参照してください。GitHub にプッシュ → Cloudflare Pages に接続 → 独自ドメイン `jaebc.com` を紐付け、の3ステップで公開できます。

## ブランドカラー

| 色 | HEX | 用途 |
|---|---|---|
| Green | `#1FA24A` | アクセント |
| Yellow | `#F4C52E` | アクセント |
| Red | `#E53935` | アクセント |
| Ink | `#111111` | 本文 |
| Cream | `#FFFCF5` | 背景 |

## ライセンス

© 2025–2026 株式会社ステージバンク / Stagebank, Inc. All rights reserved.
ロゴおよびブランド資産は JAEBC に帰属します。改変禁止。
