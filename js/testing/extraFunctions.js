
export function searchTree(root, str) {
// http://stackoverflow.com/questions/9133500/how-to-find-a-node-in-a-tree-with-javascript
	var stack = [], node, ii;
	stack.push(root);
	var results = [];

	while (stack.length > 0) {
		node = stack.pop();
		if (node.children && node.children[0] == str) {
			// Found it!
			// return node;
			results.push(node);
		}
		if (node.children && node.children.length) {
			for (ii = 0; ii < node.children.length; ii += 1) {
				stack.push(node.children[ii]);
			}
		}
	}
	return results;
}

export function searchTreeForProps(root, props) {
// http://stackoverflow.com/questions/9133500/how-to-find-a-node-in-a-tree-with-javascript
	var stack = [], node, ii;
	stack.push(root);
	var results = [];

	if (root == null || props == null) {
		console.error("need to pass both a root element and props to check");
		return results;
	}

	while (stack.length > 0) {
		node = stack.pop();
		if (node.props) {
			// console.log("node.props: ", node.props);
			for (var key in props) {
				// console.log("checking: key:", key, ", node.props[key]: ", node.props[key], ", props[key]:", props[key]);
				if (node.props[key] != null && node.props[key] != null && node.props[key].match(props[key])) {
					// Found it!
					results.push(node);
				}
			}
		}
		if (node.children && node.children.length) {
			for (ii = 0; ii < node.children.length; ii += 1) {
				stack.push(node.children[ii]);
			}
		}
	}
	return results;
}


export function searchTreeForClassName(root, str) {
// http://stackoverflow.com/questions/9133500/how-to-find-a-node-in-a-tree-with-javascript
	var stack = [], node, ii;
	stack.push(root);
	var results = [];
	while (stack.length > 0) {
		node = stack.pop();
		if (node.props && node.props.className != null && node.props.className.match(str)) {
			// Found it!
			results.push(node);
		}
		if (node.children && node.children.length) {
			for (ii = 0; ii < node.children.length; ii += 1) {
				stack.push(node.children[ii]);
			}
		}
	}
	return results;
}


