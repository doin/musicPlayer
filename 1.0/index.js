/**
 * @fileoverview 
 * @author doin<hansheng.sl@taobao.com>
 * @module musicPlayer
 **/
KISSY.add(function (S, Node,Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * 
     * @class MusicPlayer
     * @constructor
     * @extends Base
     */
    function MusicPlayer(comConfig) {
        var self = this;
        //调用父类构造函数
        MusicPlayer.superclass.constructor.call(self, comConfig);
    }
    S.extend(MusicPlayer, Base, /** @lends MusicPlayer.prototype*/{

    }, {ATTRS : /** @lends MusicPlayer*/{

    }});
    return MusicPlayer;
}, {requires:['node', 'base']});



