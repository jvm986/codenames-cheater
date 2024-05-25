import { Board, Cell, Team } from '../types'

export class BoardHandler {
  public board: Board
  constructor(html: string) {
    this.board = this.extractGameBoard(html)
  }

  private extractGameBoard(html: string): Board {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    const boardElement = doc.querySelector('.board')
    const turn = boardElement?.className.split(' ')[1].split('-')[0]

    const board: Board = {
      cells: [],
      turn: turn as Team,
    }

    const rows = doc.querySelectorAll('.board .cell')
    let currentRow: Cell[] = []

    rows.forEach((cellElement, index) => {
      const classList = cellElement.classList
      const teamClass = Array.from(classList).find((cls) =>
        ['blue', 'red', 'neutral', 'black'].includes(cls)
      )
      const revealed = classList.contains('revealed')
      const word = (cellElement.querySelector('.word') as HTMLElement).innerText

      let team: Team
      if (teamClass === 'black') {
        team = 'assassin'
      } else {
        team = teamClass as Team
      }

      const cell: Cell = {
        word,
        team,
        revealed,
      }

      currentRow.push(cell)

      if ((index + 1) % 5 === 0) {
        board.cells.push(currentRow)
        currentRow = []
      }
    })

    return board
  }
  public stringifyBoard(): string {
    return this.board.cells
      .map((row) =>
        row
          .map(
            (cell) =>
              `${cell.word} (${cell.team}${cell.revealed ? ', revealed' : ''})`
          )
          .join(' | ')
      )
      .join('\n')
  }

  public generateHintPrompt(): string {
    const boardString = this.stringifyBoard()
    const turn = this.board.turn

    return `
    I am playing a game of Codenames. Below is the current state of the game board:

    ${boardString}
    
    Please provide 3 hints for the ${turn} team. Focus only on the words that are not yet revealed, and avoid suggesting the assassin word, the other team's words, and neutral words. For each hint, include a very brief justification.
    
    Provide the response as a JSON object wrapped in triple backticks, adhering to the following schema:
    
    {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "team": {
            "type": "string",
            "enum": ["red", "blue"]
          },
          "hint": {
            "type": "string"
          },
          "words": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "number": {
            "type": "integer"
          },
          "justification": {
            "type": "string"
          }
        },
        "required": ["team", "hint", "words", "number", "justification"]
      }
    }
    This should be an array of 3 total objects. Wrap the JSON object in triple backticks with the language identifier "json" to ensure proper formatting.
    `
  }
}
