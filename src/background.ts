import { askChatGpt } from './scripts/ChatGpt'
import { Message } from './types'

chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    if (message.action === 'askChatGpt') {
      askChatGpt(message.data).then(sendResponse)
    }
    return true
  }
)

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable()

  const enableOnHttpPages = {
    conditions: [
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { schemes: ['https', 'http'] },
      }),
    ],
    actions: [new chrome.declarativeContent.ShowAction()],
  }

  chrome.declarativeContent.onPageChanged.addRules([enableOnHttpPages])
})
