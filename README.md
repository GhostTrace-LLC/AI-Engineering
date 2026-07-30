# AI Engineering

پروژه یادگیری و آزمایش مهندسی هوش مصنوعی با **Nuxt 4** و **Vue 3**.

این مخزن شامل یک برنامه چت استریم‌شده است که امکان گفت‌وگو با مدل‌های هوش مصنوعی را فراهم می‌کند. در حال حاضر دو ارائه‌دهنده پشتیبانی می‌شود:

- **Ollama** (اجرای محلی)
- **Grok** (مدل‌های xAI)

رابط کاربری کاملاً فارسی و راست‌به‌چپ (RTL) طراحی شده است.

---

## ویژگی‌ها

- چت استریم‌شده (Streaming) با نمایش تدریجی پاسخ
- انتخاب آسان بین Ollama و Grok از طریق رابط کاربری
- رابط کاربری مدرن با Nuxt UI و Tailwind CSS
- پشتیبانی کامل از زبان فارسی و جهت RTL
- معماری تمیز با جداسازی API سمت سرور
- استفاده از Vercel AI SDK برای یکپارچه‌سازی آسان مدل‌ها

---

## فناوری‌های استفاده‌شده

| دسته              | فناوری                          |
|-------------------|---------------------------------|
| فریم‌ورک          | Nuxt 4 + Vue 3                  |
| هوش مصنوعی        | Vercel AI SDK (`ai`, `@ai-sdk/vue`, `@ai-sdk/xai`) |
| مدل محلی          | Ollama (`ollama-ai-provider-v2`) |
| UI                | Nuxt UI 4 + Tailwind CSS 4      |
| مدیریت وضعیت      | Pinia                           |
| زبان              | TypeScript                      |
| اعتبارسنجی        | Zod                             |
| سایر              | VueUse, Iconify (Lucide)        |

---

## پیش‌نیازها

- Node.js نسخه ۱۸ یا بالاتر
- pnpm (پیشنهادی)، npm، yarn یا bun
- برای استفاده از Ollama: نصب و اجرای [Ollama](https://ollama.com) روی سیستم محلی
- برای استفاده از Grok: کلید API از [xAI](https://x.ai)

---

## نصب و راه‌اندازی

۱. مخزن را کلون کنید:

```bash
git clone https://github.com/peeymaann/AI-Engineering.git
cd AI-Engineering

……………

۲. وابستگی‌ها را نصب کنید:
Bash

pnpm install
# یا
npm install
# یا
yarn install
# یا
bun install

……………

۳. متغیرهای محیطی را تنظیم کنید (در صورت نیاز به API):
فایل .env را در ریشه پروژه ایجاد کنید:
envXAI_API_KEY=your_xai_api_key_here

……………

۴. سرور توسعه را اجرا کنید:
Bash

pnpm dev
# یا
npm run dev
