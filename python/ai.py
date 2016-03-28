'''
Otello, by Tyler Leite
Beginner AI Priorities

1. capture
2. edge
3. not adjacent to enemy (unless opposite is edge)
4. random
	
Intermediate AI Priorities
1. edge
2. edge connected to edge group
3. block capture
4. block strategic placement
5. capture, unless obvious trap
6. filler move
7. random
	
'''

import random

class BeginnerAI:
	def __init__(self):
		self.playing = True
	
	def OT_set_side(self, side):
		self.side = side
		self.opp_side = 'X'
		if side == 'X':
			self.opp_side = 'O'
	
	def OT_set_dimensions(self, wdt, hgt):
		self.width, self.height = wdt, hgt
		self.board = [['.' for x in range(self.width)] for y in range(self.height)]
		
	def OT_update_board(self, gamestate):
		gs = list(gamestate)
		x,y = 0,0
		for square in gs:
			self.board[y][x] = square
			x += 1
			if x >= self.width:
				y += 1
				x = 0
				
	def OT_get_move(self):
		return self.print_move(self.make_move())
		
	def OT_set_winner(self, result):
		self.playing = False
			
	def get(self, x, y):
		if x < 0 or y < 0 or x >= self.width or y >= self.height:
			return "?"
		return self.board[y][x]
		
	def print_move(self, move):
		x,y = move
		
		x = str(unichr(x+97))
		y = str(y+1)
		
		return x+y
	
	#assume there is an enemy piece in square sx+xdir, sy+ydir
	def check_capture(self, sx, sy, xdir, ydir):
		nx, ny = sx+xdir, sy+ydir
		if nx < 0 or ny < 0 or nx >= self.width or ny >= self.height:
			return False
		elif self.get(nx, ny) == '.':
			return False
		elif self.get(nx, ny) == self.side:
			return True
		elif self.get(nx, ny) == self.opp_side:
			return self.check_capture(nx, ny, xdir, ydir)
		else:
			return False
			
	#check if an edge piece is also a corner piece
	def is_corner(self, move):
		return move[0] in [0, self.width-1] and move[1] in [0, self.height-1]
			
	def find_corners(self, list):
		return [move for move in list if self.is_corner(move)]
		
	def make_move(self):
		possible_moves = []
		for y in range(self.height):
			for x in range(self.width):
				if self.get(x, y) == '.':
					possible_moves.append((x, y))
		
		capture = []
		edge = []
		not_terrible = []
		for move in possible_moves:
			x,y = move
			
			for i in range (-1, 2):
				for j in range(-1, 2):
					if self.get(x+i, y+j) == self.opp_side:
						if self.check_capture(x, y, i, j):
							#y gets flipped somewhere
							new_move = x,self.height-y
							capture.append(new_move)
							
					oppose = self.get(x-i, y-j)
					if oppose in [self.opp_side, '?']:
						not_terrible.append(move)
					
			if x == 0 or y == 0 or x == self.width-1 or y == self.height-1:
				edge.append(move)
				
		capture = [move for move in capture if move in not_terrible]
		edge = [move for move in edge if move in not_terrible]
				
		if capture:
			print "capture"
			return random.choice(capture)
		elif edge:
			print "edge"
			corners = self.find_corners(edge)
			if corners:
				return random.choice(corners)
			return random.choice(edge)
		elif not_terrible:
			print "not terrible"
			return random.choice(not_terrible)
		else:
			return random.choice(possible_moves)
			