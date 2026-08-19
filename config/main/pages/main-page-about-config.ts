import { AboutPageType } from "@/types";
import {
  ComputerDesktopIcon,
  LockClosedIcon,
  SparklesIcon,
  UsersIcon,
} from "@heroicons/react/20/solid";

const mainPageAboutConfig: AboutPageType = {
  general: {
    title: "关于本站",
    subTitle: "把值得使用的免费资源，认真地整理出来。",
    description:
      "这里记录学习与实践，也长期筛选免费工具、开源项目和可靠的线上资源。",
    paragraphs: [
      {
        description:
          "本站不提供付费会员、订阅收费或广告位。每一项推荐都应当有清晰来源、用途说明和最后检查时间。",
      },
      {
        description:
          "希望它成为一个可以反复访问的安静角落：少一点噪声，多一点经过筛选、能真正帮上忙的内容。",
      },
    ],
  },
  features: [
    {
      name: "认真筛选",
      description:
        "优先收录明确免费、长期可用且来源可靠的内容，不追求资源数量。",
      icon: ComputerDesktopIcon,
    },
    {
      name: "保持透明",
      description:
        "资源会显示链接、分类与检查日期；发现失效或信息错误时，可以直接反馈。",
      icon: LockClosedIcon,
    },
    {
      name: "开放分享",
      description:
        "欢迎提交值得被更多人看见的免费工具、项目和学习资源，由管理员审核后发布。",
      icon: SparklesIcon,
    },
    {
      name: "长期维护",
      description:
        "内容与设计都以长期阅读和使用为目标，尽量避免短期潮流带来的负担。",
      icon: UsersIcon,
    },
  ],
};

export default mainPageAboutConfig;
