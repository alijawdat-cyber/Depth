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
      // منع استيراد lucide-react مباشرة خارج ملف Icon.tsx
      'import/no-restricted-paths': ["error", {
        zones: [
          {
            target: "./src",
            from: "lucide-react",
            message: "يُمنع استيراد lucide-react مباشرة؛ استعمل src/components/primitives/Icon.tsx",
            except: ["./src/components/primitives/Icon.tsx"],
          }
        ]
      }],

      // منع بعض inline styles الخطرة: color/background/border/boxShadow
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='style'] ObjectExpression > Property[key.name=/^(color|background|backgroundColor|border|boxShadow)$/]",
          message: "ممنوع تعيين خصائص الألوان/الخلفيات/الحدود/الظلال inline — استخدم CSS vars والتوكنات.",
        }
      ],
    }
  }
];

export default eslintConfig;
