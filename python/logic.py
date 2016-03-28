'''Otello, by Tyler Leite'''

class Board:
	def __init__(self, wdt, hgt):
		self.wdt = wdt
		self.hgt = hgt
		self.reset()
		
	def reset(self):
		self.board = [['.' for x in range(self.wdt)] for y in range(self.hgt)]
		self.empty_squares = self.wdt * self.hgt
		
	def full(self):
		return self.empty_squares == 0
	
	def dominance(self):
		x_ct, o_ct = 0, 0
		for y in self.board:
			for x in y:
				if x == 'X':
					x_ct += 1
				elif x == 'O':
					o_ct += 1
		return x_ct, o_ct
	
	def in_bounds(self, x, y):
		if x < 0 or x >= self.wdt or y < 0 or y >= self.hgt:
			return False
		else:
			return True
	
	def set(self, x, y, piece):
		if self.in_bounds(x, y):
			self.board[y][x] = piece
			return True
		else:
			return False
	
	def opp_turn(self, turn):
		opp = "X"
		if turn == "X":
			opp = "O"
		return opp
		
	def get(self, x, y):
		if self.in_bounds(x, y):
			return self.board[y][x]
		else:
			return False
	
	def check_reversi(self, sx, sy, xdir, ydir, turn):
		nx, ny = sx+xdir, sy+ydir
		if not self.in_bounds(nx, ny):
			return False
		elif self.get(nx, ny) == '.':
			return False
		elif self.get(nx, ny) == turn:
			self.set(sx, sy, turn)
			return True
		elif self.get(nx, ny) == self.opp_turn(turn):
			if self.check_reversi(nx, ny, xdir, ydir, turn):
				self.set(sx, sy, turn)
				return True
			else:
				return False
	
	def place(self, x, y, turn):
		if not self.in_bounds(x, y):
			return False
		elif not self.get(x, y) == '.':
			return False
		
		self.set(x, y, turn)
		self.empty_squares -= 1
	
		for j in range(-1, 2):
			for i in range(-1, 2):
				nx = x+i
				ny = y+j
				
				if self.in_bounds(nx, ny) and self.get(nx, ny) == self.opp_turn(turn):
						self.check_reversi(nx, ny, i, j, turn)
				else:
					continue
					
		return True
		
	def draw(self):
		for y in range(self.wdt):
			for x in range(self.hgt):
				if x == 0:
					print self.hgt-y,
				print self.board[y][x],
			print ''
		print ' ',
		for i in range(self.wdt):
			print str(unichr(97+i)),
		print ''

class Input:
	def prompt_move(self, msg=""):
		return raw_input(msg)
		
	def prompt_menu(self, msg=""):
		return raw_input(msg)
		
class Output:
	def welcome(self):
		print "Welcome to Otello!"
		
	def to_move(self, turn):
		print turn.upper() + " to move: "
		
	def poll_move(self):
		print "Where do you want to place your piece? "
		
	def illegal_move(self):
		print "That move is illegal."
	
	def player_forfeits(self, turn):
		print turn + " forfeits! Gg no re"
		
	def menu(self):
		print "h ....... help / tutorial"
		print "g ....... start game"
		print "a ....... start game vs ai"
		print "q ....... quit"
		
	def controls(self):
		print "f is forfeit"
		print "a5 puts a piece on a5"
		
	def tutorial(self):
		print "Basically reversi"
		
	def wins(self, winner, win_dom, lose_dom):
		print winner, " wins, ", win_dom, " - ", lose_dom, "! GG"