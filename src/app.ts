import "./wasm/wasm_exec"

import highlight from "./highlight";
import {Options} from "./convert";

const $input = document.getElementById("input");
const $output = document.getElementById("output");
const $sample = document.getElementById("sample");
const $comments = document.getElementById("comments") as HTMLInputElement;
const $positions = document.getElementById("positions") as HTMLInputElement;
const $references = document.getElementById("references") as HTMLInputElement;

const options = new Options($comments.checked, $positions.checked, $references.checked);

function doConversion() {
    const result = globalThis.astyJSON2Go($input.innerText.trim(), options.comments, options.positions, options.references);

    if (result !== "") {
        $output.innerHTML = highlight(result);
    } else {
        $output.innerHTML = "";
    }
}

function astyWasmURL() {
    if (location.pathname.startsWith("/home/")) {
        return "http://localhost:8080/asty.wasm";
    }

    return "/static/js/wasm/asty.wasm";
}

$input.addEventListener("keyup", doConversion);

$comments.addEventListener("change", function () {
    options.comments = $comments.checked;

    doConversion();
});

$positions.addEventListener("change", function () {
    options.positions = $positions.checked;

    doConversion();
});

$references.addEventListener("change", function () {
    options.references = $references.checked;

    doConversion();
});

$sample.addEventListener("click", function () {
    $input.innerText = sample;

    doConversion();
});

// https://dou.ua/forums/topic/32689/
// language=Go
const sample = `package main

import "fmt"

func main() {
	fmt.Println("Привіт, світе!")
}`;

// Go from ./wasm/wasm_exec
const go = new globalThis.Go();
WebAssembly
    .instantiateStreaming(fetch(astyWasmURL()), go.importObject)
    .then(function (result) {
        go.run(result.instance);
    });
