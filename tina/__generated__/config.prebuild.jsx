// tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH ?? process.env.VERCEL_GIT_COMMIT_REF ?? process.env.GITHUB_BRANCH ?? "claude/rankpilot-website-bnnCr",
  // TinaCloud credentials come from env (set in Vercel). Never hard-code them.
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
      static: false
    }
  },
  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN,
      stopwordLanguages: ["eng"]
    },
    indexBatchSize: 100,
    maxSearchIndexFieldLength: 100
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Blog Posts",
        path: "content/posts",
        format: "md",
        ui: {
          router: ({ document }) => `/blog/${document._sys.filename}`
        },
        defaultItem: () => ({
          date: (/* @__PURE__ */ new Date()).toISOString(),
          author: { name: "RiseRidge Team" }
        }),
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "excerpt",
            label: "Excerpt",
            required: true,
            ui: { component: "textarea" }
          },
          {
            type: "datetime",
            name: "date",
            label: "Publish Date",
            required: true
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            required: true,
            options: [
              "SEO Strategy",
              "Technical SEO",
              "Content Marketing",
              "AI & Search",
              "Case Studies",
              "Industry Insights"
            ]
          },
          {
            type: "object",
            name: "author",
            label: "Author",
            fields: [
              {
                type: "string",
                name: "name",
                label: "Name",
                required: true
              }
            ]
          },
          {
            type: "image",
            name: "coverImage",
            label: "Cover Image"
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
