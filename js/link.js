/*jslint indent: 4 */
/*global chrome*/
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

var LinkModel = function () {}

LinkModel.prototype = {
	getLink: function(url, callback) {
        this.getLinks(function(data) {
            var dato = {};
            for (ind in data) {
                dato = data[ind] || {};
                if (dato.url === url){
                    callback (dato);
                    return;
                }
            }
            callback (undefined);
        });
	},
	getLinks: function(callback) {
        chrome.storage.local.get("links", function(data) {
            callback(data.links);
        });
	},
	saveLink: function(new_link, callback) {
        var self = this;
        this.getLinks(function(data) {
            var new_data = data || [],
                url = new_link.url || "";

            if (url === "") return;

            self.getLink (url, function (data) {
                if (! data) {
                    new_data.push(new_link);
                    chrome.storage.local.set({"links": new_data}, callback);
                }
            });

        });
	},
    delLink: function(url, callback) {
        var self = this;
        this.getLinks(function(links) {
            var ind     = 0,
                the_ind = -1,
                my_url  = "";

            for (ind in links)
            {
                my_url = links[ind].url || "";
                if (my_url === url) {
                    the_ind = ind;
                    break;
                }
            }

            if (the_ind !== -1) {
                links.splice(the_ind, 1);
                chrome.storage.local.set({"links": links}, callback);
            }
        });
    }
};