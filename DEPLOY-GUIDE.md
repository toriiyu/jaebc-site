# JAEBC.com 公開手順書

GitHub + Cloudflare Pages で `jaebc.com` を公開する完全ガイドです。
所要時間は **合計30〜60分** 程度（ドメイン伝播を除く）。

---

## ✅ 事前に用意するもの

- [ ] GitHub アカウント（未取得なら https://github.com/join で作成）
- [ ] Cloudflare アカウント（未取得なら https://dash.cloudflare.com/sign-up で作成）
- [ ] ドメイン `jaebc.com` — まだ取得していない場合、Cloudflare Registrar で取得するのが最速・最安
- [ ] ロゴ画像 `logo.png`（ご提供いただいたもの）
- [ ] PC に Git がインストール済み（Mac: `brew install git` / Windows: https://git-scm.com/）

---

## 🟢 ステップ 1 — ローカルの準備（5分）

### 1-1. このフォルダ内のファイル確認

このフォルダには以下が入っています。

```
index.html
logo.png         ← ご自身で配置してください
_headers
robots.txt
sitemap.xml
.gitignore
README.md
DEPLOY-GUIDE.md  （このファイル）
```

### 1-2. ロゴ画像の配置（重要）

元のロゴPNG画像を、このフォルダ内に **`logo.png` という名前で保存**してください。
（改変しないオリジナルのファイルをそのままお使いください。）

---

## 🟢 ステップ 2 — GitHub にリポジトリ作成（10分）

### 2-1. GitHub で新規リポジトリを作成

1. https://github.com/new にアクセス
2. Repository name: **`jaebc-site`**（お好みでOK）
3. Public / Private どちらでも可（Cloudflare Pagesは両対応）
4. **"Add a README file" などにチェックを入れない**（既に一式あるため）
5. 「Create repository」をクリック

### 2-2. ローカルでGit初期化してプッシュ

ターミナル（Mac）または PowerShell（Windows）で、このフォルダに移動してから：

```bash
# このフォルダに移動（※実際のパスに置き換えてください）
cd "/path/to/this/folder"

# Git初期化
git init
git add .
git commit -m "Initial commit: JAEBC site"

# GitHubリポジトリと接続（YOUR_USERNAME を自分のGitHubユーザー名に）
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/jaebc-site.git
git push -u origin main
```

初回プッシュ時にGitHubのログイン（またはPersonal Access Token）を求められます。

---

## 🟢 ステップ 3 — Cloudflare Pages で公開（10分）

### 3-1. プロジェクト作成

1. https://dash.cloudflare.com にログイン
2. 左メニュー **「Workers & Pages」** → 「Create」→ **「Pages」** タブ → **「Connect to Git」**
3. GitHub連携を承認（初回のみ）→ 先ほど作った `jaebc-site` を選択
4. 「Begin setup」をクリック

### 3-2. ビルド設定

| 項目 | 値 |
|---|---|
| Project name | `jaebc` |
| Production branch | `main` |
| Framework preset | **None** |
| Build command | （空欄でOK） |
| Build output directory | `/` |

「Save and Deploy」をクリック → 1〜2分でビルド完了。
`https://jaebc.pages.dev` のようなURLで仮公開されます。

---

## 🟢 ステップ 4 — 独自ドメイン jaebc.com を紐付け（15分 + DNS伝播）

### 4-1. ドメイン取得（まだの場合）

Cloudflare Registrar が最安値（卸値）＋設定が自動でおすすめ。

1. Cloudflare左メニュー **「Domain Registration」** → 「Register Domains」
2. `jaebc.com` を検索 → 購入

**他社（お名前.com、GoDaddy等）で取得済みの場合：**
1. Cloudflare左メニュー **「Websites」** → 「Add a Site」 → `jaebc.com`
2. Freeプランを選択
3. 表示される **Cloudflareネームサーバー2本**を、取得元レジストラの管理画面で設定
4. 伝播完了（数分〜最大48時間）を待つ

### 4-2. Pagesにカスタムドメインを追加

1. Cloudflare Pages プロジェクト（`jaebc`）→ **「Custom domains」** タブ
2. 「Set up a custom domain」→ `jaebc.com` を入力 → Continue
3. `www.jaebc.com` も同様に追加（推奨）

CloudflareでDNS管理していれば、CNAMEレコードは自動で追加されます。
HTTPS証明書も自動発行（数分）。

### 4-3. www → apex のリダイレクト（推奨）

Cloudflareダッシュボード → 対象ドメイン → **「Rules」→「Redirect Rules」**：

| 項目 | 値 |
|---|---|
| If | `Hostname equals www.jaebc.com` |
| Then | `Dynamic → concat("https://jaebc.com", http.request.uri.path)` |
| Status | `301` |

---

## 🟢 ステップ 5 — 公開後の確認（5分）

- [ ] `https://jaebc.com` にアクセスできる
- [ ] `https://www.jaebc.com` → `https://jaebc.com` にリダイレクトされる
- [ ] スマホでも表示崩れがない
- [ ] JA / EN 言語切替が動く
- [ ] ロゴが正しく表示される
- [ ] お問い合わせフォームが送信できる（※現在はダミー、後日バックエンド連携を推奨）

---

## 🔄 更新の流れ（以降ずっと使う）

サイトを更新したくなったら、**GitHubにpushするだけ** でCloudflare Pagesが自動で再デプロイします。

```bash
# index.html などを編集したあと
git add .
git commit -m "更新内容の説明"
git push
```

ブラウザで約1〜2分後にリロードすると反映されます。

---

## 💡 次にやると良いこと（任意）

### お問い合わせフォームを実稼働させる
現状のフォームはアラート表示のみ。以下いずれかで受信可能にできます：
- **Formspree**（https://formspree.io/） — 月50通まで無料、HTML改修不要
- **Cloudflare Workers + メール送信API** — 柔軟だが要実装
- **Google Forms埋め込み** — 最簡単、ただし見た目は標準

### アナリティクス
- **Cloudflare Web Analytics**（無料・Cookie不要・GDPR配慮済み）Cloudflareダッシュボードから1クリックで有効化
- または Google Analytics 4

### OGP画像（SNSシェア用）
ヒーロー画像ベースのOGP（1200×630px）を作成し、`index.html` の `<head>` に以下を追加：
```html
<meta property="og:title" content="JAEBC | 日本アフリカエンタメ事業協議会">
<meta property="og:description" content="...">
<meta property="og:image" content="https://jaebc.com/ogp.png">
<meta property="og:url" content="https://jaebc.com">
```

### ニュースCMS化
記事が増えたら **microCMS**（日本裴、無料枠あり）や **Contentful** を導入すると、非エンジニアでも更新できます。

---

## 🆘 トラブルシュート

**Q. `git push` で permission denied と出る**
A. HTTPS の場合は Personal Access Token が必要です。https://github.com/settings/tokens で発行。
   SSH 推奨の場合は `git remote set-url origin git@github.com:YOUR_USERNAME/jaebc-site.git` に切り替え。

**Q. Cloudflare Pages でデプロイが失敗する**
A. Build output directory を `/` にしていることを再確認。`dist/` 等にすると失敗します。

**Q. 独自ドメインが「Pending」のまま**
A. ネームサーバーの伝播待ち。最大48時間ですが通常は数十分で反映されます）。
   https://www.whatsmydns.net/ で NS レコードの伝播状況を確認できます．

**Q. ロゴが表示されない**
A. ファイル名が `logo.png` になっているか、フォルダ直下に置かれているかを確認。
   大文字小文字もCloudflareでは区別されます（`Logo.PNG` ではダメ）。

---

ご不明点があれば、いつでもご相談ください。
