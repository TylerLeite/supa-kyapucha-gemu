'''Otello, by Tyler Leite'''

import ai
import logic

class Game:
	def __init__(self):
		self.running = True
		self.turn = 'X'
		self.board = logic.Board(7, 7)
		self.input = logic.Input()
		self.output = logic.Output()
		self.mode = "game"
	
	def run(self):
		self.output.welcome()
		while self.running:
			if self.mode == "menu":
				self.menu()
			elif self.mode == "game":
				self.game()
	
	def menu(self):
		self.output.menu()
		self.input.prompt_menu()
	
	def game(self):
		self.output.to_move(self.turn)
		self.board.draw()
		
		if self.board.full():
			x_ct, o_ct = self.board.dominance()
			if x_ct > o_ct:
				self.output.wins("Player 1 (X)", x_ct, o_ct)
			elif o_ct > x_ct:
				self.output.wins("Player 2 (O)", o_ct, x_ct)
			self.board.reset()
			self.turn = 'X'
			return
			
		legal_move = False
		while not legal_move:
			self.output.poll_move()
			action = self.input.prompt_move().lower()
			
			if action == 'f':
				self.output.player_forfeit(self.turn)
				self.board.reset()
				self.mode = "menu"
				legal_move = True
			else:
				action = list(action)
				if len(action) == 2:
					rank = ord(action[0]) - 97
					file = self.board.hgt - ord(action[1]) + 48
					if self.board.place(rank, file, self.turn):
						legal_move = True
						if self.turn == "X":
							self.turn = "O"
						else:
							self.turn = "X"
				
				if not legal_move:
					self.output.illegal_move()
	
if __name__ == "__main__":				
	g = Game()
	g.run()