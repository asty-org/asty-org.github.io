import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";

hljs.registerLanguage("json", json);

export default function highlight(source: string): string {
    return hljs.highlight(source, {language: "json"}).value;
}
