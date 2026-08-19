import { GithubIcon } from "@/icons/socials";
import { FooterType } from "@/types";
import { default as mainCategoryConfig } from "./main-category-config";

const mainFooterConfig: FooterType = {
  categories: mainCategoryConfig,
  pages: [
    {
      title: "首页",
      slug: "/",
    },
    {
      title: "关于本站",
      slug: "/about",
    },
    {
      title: "联系",
      slug: "/contact",
    },
  ],

  socials: [
    {
      name: "Github",
      url: "https://github.com/fuuuggh",
      icon: GithubIcon,
    },
  ],
  legals: [
    {
      title: "使用条款",
      slug: "/terms",
    },
    {
      title: "隐私政策",
      slug: "/policy",
    },
  ],
  copyright: "© 2026 公益资源与博客。",
};

export default mainFooterConfig;
