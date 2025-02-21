const mockResponses = [
  "你好！很高兴见到你。",
  "这是一个很有趣的问题。让我想想...",
  "我完全理解你的观点。",
  "确实如此，我也是这么认为的。",
  "这个问题可以从几个角度来看...",
  "让我给你举个例子来说明。",
  "根据我的经验，这种情况通常...",
  "有意思的想法！我们可以进一步探讨。",
  "我同意你的看法，不过还可以考虑...",
  "这让我想起了一个相关的话题..."
]

export function getRandomResponse(): string {
  const index = Math.floor(Math.random() * mockResponses.length)
  return mockResponses[index]
} 