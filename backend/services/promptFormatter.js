function formatPromptOutput(text) {
    // Split text into lines
    const lines = text.split(/\r?\n/);
    const bulletRegex = /^(\s*)([0-9]+\.|\*|\-|•)\s+(.+)$/;
    let html = '';
    let stack = []; // Track list levels
    let prevIndent = 0;
    let inList = false;

    // Helper to replace markdown bold with <b>
    function boldify(str) {
        return str.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = bulletRegex.exec(line);
        if (match) {
            const indent = match[1].length;
            // Apply bold formatting to bullet content
            const content = boldify(match[3].trim());

            if (!inList) {
                html += '<ul>';
                stack.push(0);
                inList = true;
            } else if (indent > prevIndent) {
                html += '<ul>';
                stack.push(indent);
            } else if (indent < prevIndent) {
                while (stack.length && indent < stack[stack.length - 1]) {
                    html += '</li></ul>';
                    stack.pop();
                }
                html += '</li>';
            } else {
                html += '</li>';
            }
            html += `<li>${content}`;
            prevIndent = indent;
        } else {
            // Not a bullet line
            if (inList) {
                // End all open lists
                while (stack.length) {
                    html += '</li></ul>';
                    stack.pop();
                }
                inList = false;
                prevIndent = 0;
            }
            // Add non-list line as a paragraph or with <br>
            if (line.trim() !== '') {
                html += `<br>${boldify(line.trim())}`;
            }
        }
    }
    // Close any remaining open lists
    if (inList) {
        while (stack.length) {
            html += '</li></ul>';
            stack.pop();
        }
    }
    // Clean up any stray <br> at the start
    return html.replace(/^<br>/, '');
}

module.exports = formatPromptOutput;
