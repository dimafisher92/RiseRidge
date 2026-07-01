// tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH ?? process.env.VERCEL_GIT_COMMIT_REF ?? process.env.GITHUB_BRANCH ?? "claude/rankpilot-website-bnnCr",
  clientId: "57325307-e3e1-49db-b176-8eb56885a07b",
  token: "36967b0ae5c8c132e8c10d871c99725063a814ef",
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
      indexerToken: "bdadb52bc945b927cde5668099f2b34a0f8a69cd",
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
            type: "string",
            name: "coverImage",
            label: "Cover Image Path",
            description: "Path to an image already in /public, e.g. /blog/my-post-hero.svg. Tina media sync is not set up for this project, so this field does not use the image picker."
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
