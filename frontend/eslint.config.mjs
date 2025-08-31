import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
  ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      import: (await import("eslint-plugin-import")).default ?? (await import("eslint-plugin-import"))
    },
    rules: {
      // السماح باستيراد lucide-react مباشرة (ماكو Icon.tsx مركزي حالياً)

      // منع بعض inline styles الخطرة: color/background/border/boxShadow
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='style'] ObjectExpression > Property[key.name=/^(color|background|backgroundColor|border|boxShadow)$/]",
          message: "ممنوع تعيين خصائص الألوان/الخلفيات/الحدود/الظلال inline — استخدم CSS vars والتوكنات.",
        },
        {
          selector: "JSXAttribute[name.name='className'][value.value=/\\-\\[(?!var\\(--).+\\)\\]/]",
          message: "ممنوع استخدام Tailwind arbitrary values (مثل bg-[#...]) إلا إذا كانت تستعمل var(--token) فقط.",
        }
      ],
      // ملاحظات: أزلنا eslint-plugin-tailwindcss مؤقتاً لعدم توافقه مع Tailwind v4
    }
  }
];

export default eslintConfig;
