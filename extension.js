/*jslint indent: 4 */
/*global chrome, LinkModel, console */
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

var EXT = {};

EXT.init_function = function (tab) {
    var url       = tab.url;
        linkmodel = new LinkModel ();

    linkmodel.getLink (url, function (data) {
        if (data) {
            chrome.browserAction.setIcon ({path:"img/icon2.png"}, function () {});
        } else {
            chrome.browserAction.setIcon ({path:"img/icon.png"}, function () {});
        }
    });
}

EXT.on_click_function = function (tab) {
    var title     = tab.title,
        url       = tab.url,
        linkmodel = new LinkModel ();
    linkmodel.saveLink ({title:title, url:url, date: new Date().getTime()}, function () {
        chrome.browserAction.setIcon ({path:"img/icon2.png"}, function () {});
        EXT.update_links ();
    });
}

EXT.show_links = function () {
    if (EXT.links_tab_id) {
        chrome.tabs.update(EXT.links_tab_id, {selected: true});
        EXT.update_links ();
    } else {
        chrome.tabs.create({url:"links_page.html",pinned:true}, function (tab) {
            EXT.links_tab_id = tab.id;
            EXT.update_links ();
        });
    }
}

EXT.update_links = function () {
    var linkmodel = new LinkModel ();

    if (EXT.links_tab_id) {
        linkmodel.getLinks(function (data) {
            chrome.tabs.sendMessage (EXT.links_tab_id, {links: data});
        });
    }
}

chrome.tabs.onRemoved.addListener(function (tab_id) {
    if (tab_id === EXT.links_tab_id)
        delete EXT.links_tab_id;
});

chrome.browserAction.onClicked.addListener(EXT.on_click_function);

chrome.tabs.onActivated.addListener (function (info) {
     chrome.tabs.get(info.tabId, EXT.init_function);
});

chrome.contextMenus.create ({
    title:"View stored links.",
    type:"normal",
    onclick: EXT.show_links,
    contexts: ["all"]
    }, function () {
        console.log ("Created show links context menu");
    });