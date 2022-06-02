package main

func main() {
	hello := 10
	world := &hello
	*world = 5

	print(hello)
}
