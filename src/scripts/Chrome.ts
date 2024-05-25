import { Message } from '../types'

class Chrome {
  /**
   * Inject scripts into a given tabId.
   * The function returns the result of whatever function is passed in.
   */
  async executeScript<Type>(tabId: number, func: () => Type) {
    return (
      await chrome.scripting.executeScript({
        target: { tabId },
        func,
      })
    )[0].result as Type
  }

  async getActiveTab() {
    const config: chrome.tabs.QueryInfo = { active: true, currentWindow: true }
    return (await chrome.tabs.query(config))[0]
  }

  /**
   * Sends a message to the background script to fetch the response from the GPT-3 API
   * and return the response string.
   */
  async sendAskChatGptMessage(prompt: string): Promise<string> {
    const message: Message = { action: 'askChatGpt', data: prompt }

    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response) => {
        resolve(response)
      })
    })
  }

  async getStorage<Type>(key: string): Promise<Type> {
    const result = await chrome.storage.local.get(key)
    return result[key]
  }

  setStorage(key: string, value: unknown) {
    chrome.storage.local.set({ [key]: value })
  }
}

export default new Chrome()
