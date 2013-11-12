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

"use strict";

var EXT = {};

EXT.init_function = function (tab) {
    var url       = tab.url,
        linkmodel = new LinkModel();

    linkmodel.getLink(url, function (data) {
        if (data) {
            chrome.browserAction.setIcon({path: "img/icon2.png"}, function () {});
        } else {
            chrome.browserAction.setIcon({path: "img/icon.png"}, function () {});
        }
    });
};

EXT.get_keywords = function (tab) {
    if (tab) {
        chrome.tabs.executeScript(tab.id, {file: "js/keywords.js"},
            function (res) {
                var kw_str   = res && res[0],
                    keywords = kw_str ? kw_str.split(",") : [];

                if (keywords === []) return;

                chrome.runtime.sendMessage({
                    operation: "update",
                    link: { url: tab.url,
                            keywords: keywords}
                });
            }
        );
    }
};

EXT.get_description = function (tab) {
    if (tab) {
        chrome.tabs.executeScript(tab.id, {file: "js/description.js"},
            function (res) {
                var desc_str = res && res[0];

                if (desc_str === "") return;

                chrome.runtime.sendMessage({
                    operation: "update",
                    link: { url: tab.url,
                            description: desc_str}
                });
            }
        );
    }
};

EXT.on_click_function = function(tab) {
    var linkmodel = new LinkModel();

    linkmodel.getLink(tab.url, function (link){

        if (link) {
            linkmodel.delLink(tab.url, function() {
                chrome.browserAction.setIcon ({path: "img/icon.png"}, function () {});
            });
        } else {
            linkmodel.saveLink (
                {   title: tab.title,
                    url: tab.url,
                    date: new Date().getTime()
                }, function () {
                    chrome.browserAction.setIcon ({path: "img/icon2.png"}, function () {});
                    EXT.get_keywords(tab);
                    EXT.get_description(tab);
                    EXT.refresh_links ();
                }
            );
        }


    });
};

EXT.show_links = function () {
    if (EXT.links_tab_id) {
        chrome.tabs.update(EXT.links_tab_id, {selected: true});
        EXT.refresh_links ();
    } else {
        chrome.tabs.create({url: "links_page.html",pinned:true}, function (tab) {
            EXT.links_tab_id = tab.id;
            EXT.refresh_links ();
        });
    }
};

EXT.refresh_links = function () {
    var linkmodel = new LinkModel ();

    if (EXT.links_tab_id) {
        linkmodel.getLinks(function (data) {
            chrome.tabs.sendMessage (EXT.links_tab_id, {links: data});
        });
    }
};

EXT.update_link = function (link) {
    var url       = link && link.url,
        linkmodel = new LinkModel();

    if (!url) return;

    linkmodel.getLink(url, function (data) {
        var fields = Object.keys(link),
            ind = 0;

        if (! data) return;

        for (ind in fields){
            data[fields[ind]] = link[fields[ind]];
        }

        linkmodel.saveLink(data, function () {});
    });
};

EXT.delete_link = function (link) {
    var linkmodel = new LinkModel();

    linkmodel.delLink(link.url, function () {});
};

chrome.tabs.onRemoved.addListener(function (tab_id) {
    if (tab_id === EXT.links_tab_id)
        delete EXT.links_tab_id;
});

chrome.browserAction.onClicked.addListener(EXT.on_click_function);

chrome.tabs.onActivated.addListener (function (info) {
    chrome.tabs.get(info.tabId, EXT.init_function);
});

chrome.contextMenus.create (
    {   title: "View stored links.",
        type: "normal",
        onclick: EXT.show_links,
        contexts: ["all"]
    }, function () {
        console.log ("Created show links context menu");
    }
);

chrome.runtime.onMessage.addListener(function (message) {
    var link   = message && message.link,
        op     = message && message.operation;

    if (!link || !op) return;

    switch (op) {
    case "update":
        EXT.update_link(link);
        break;
    case "delete":
        EXT.delete_link(link);
        break;
    case "refresh_list":
        EXT.show_links();
        break;
    default:
        console.log("Operation name \""+ op +"\" not recognized.");
    }
});