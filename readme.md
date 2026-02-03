
base_url="https://openrouter.ai/api/v1",
api_key="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",
model="deepseek/deepseek-v3.2"


#角色：现在你是一个资深架构师，能够拆解需求
#背景：现在需要实现一个 interview summary product，输入为一段 interview transscript，你可以暂时理解为一段文本
#功能：
    1. 能够从 interview transscript 中提取出面试者的相关标签，例如 面试者的姓名、工作经验、技能等等
    2. 能够将面试内容转换 面试官与面试者 对话的每轮内容，每轮内容包含 面试官的问题 与 面试者的回答以及时间
    3. 能够提取面试者的亮点、 weakness 以及 其他重要信息
    4. 需要接入模型 AI 能力，采用 deepseek/deepseek-v3.2 模型

#约束：
    1. 你的产出是一个可供AI实现的技术文档，能够支撑后续 vibe coding 开发


#角色：现在你是一个资深的开发人员，精通前后端开发，并且能够应用 AI 接入能力
#背景：基于 AI 模型能力，实现 interview summary product
#技术架构：React + deepseek/deepseek-v3.2，暂不需要接入后端能力
#功能：
    1. 能够从用户输入的 interview transscript 中提取出面试者的相关标签
    2. 能够将面试内容转换 面试官与面试者 对话的每轮内容，转换为简要的时间线模式，结构例如 - time: introdution xxxx
       - time: discussiontopic xxxxx
    3. 能够提取面试者的亮点、 weakness 以及 其他重要信息
    4. 能够调用 deepseek/deepseek-v3.2 模型，实现对面试内容的分析
    5. 输出分析结果，包括 面试者的相关标签、 每轮面试内容、 面试者的亮点、 weakness 以及 其他重要信息
#约束：
    1.你最后产出一个页面，能够支持用户输入 interview transscript 并展示分析结果；
    2.你需要使用提供的模型以及 api_key 如下
        base_url="https://openrouter.ai/api/v1",
        api_key="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",
        model="deepseek/deepseek-v3.2"