/*jslint indent: 4 */
/*  Simple Chromium extension to store links really fast.

       Copyright (C) 2013  Marcos Chavarría Teijeiro <chavarria1991@gmail.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
var metas = document.getElementsByTagName("meta"),
    i = 0,
    result = "";

for (i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute("name") === "description") {
        result = metas[i].getAttribute("content");
        break;
    }
}
result;