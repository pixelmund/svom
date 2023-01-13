/**
 * 
 *  MIT License

    Copyright (c) 2021 Aaron Pettengill

    https://github.com/airjp73/remix-validated-form

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
 * 
 */

export const stringToPathArray = <T extends string>(path: T): (string | number)[] => {
	if (path.length === 0) return [];

	const match = path.match(/^\[(.+?)\](.*)$/) || path.match(/^\.?([^\.\[\]]+)(.*)$/);
	if (match) {
		const [_, key, rest] = match;
		return [/^\d+$/.test(key) ? Number(key) : key, ...stringToPathArray(rest)];
	}
	return [path];
};

export function setPath<T>(object: T, path: string, defaultValue: any) {
	return _setPathNormalized(object, stringToPathArray(path), defaultValue);
}

function _setPathNormalized(object: any, path: (string | number)[], value: any): any {
	const leadingSegments = path.slice(0, -1);
	const lastSegment = path[path.length - 1];

	let obj = object;
	for (let i = 0; i < leadingSegments.length; i++) {
		const segment = leadingSegments[i];
		if (obj[segment] === undefined) {
			const nextSegment = leadingSegments[i + 1] ?? lastSegment;
			obj[segment] = typeof nextSegment === 'number' ? [] : {};
		}
		obj = obj[segment];
	}
	obj[lastSegment] = value;
	return object;
}
