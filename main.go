package main

import (
	"encoding/json"
	"fmt"
	"go/parser"
	"syscall/js"

	"github.com/asty-org/asty/asty"
)

func main() {
	fmt.Println("Golang WebAssembly main")

	done := make(chan struct{})
	js.Global().Set("astyJSON2Go", js.FuncOf(json2GoWrapper))
	<-done
}

func json2GoWrapper(this js.Value, args []js.Value) interface{} {
	var (
		input      = args[0].String()
		comments   = args[1].Bool()
		positions  = args[2].Bool()
		references = args[3].Bool()
	)

	content, err := json2Go(
		input,
		comments,
		positions,
		references,
	)

	if err != nil {
		return err.Error()
	}

	return content
}

func json2Go(input string, comments, positions, references bool) (string, error) {
	marshaller := asty.NewMarshaller(comments, positions, references)

	mode := parser.SkipObjectResolution
	if comments {
		mode |= parser.ParseComments
	}
	tree, err := parser.ParseFile(marshaller.FileSet(), "", input, mode)
	if err != nil {
		return "", err
	}

	node := marshaller.MarshalFile(tree)

	content, err := json.MarshalIndent(node, "", "  ")
	if err != nil {
		return "", err
	}

	return string(content), nil
}
