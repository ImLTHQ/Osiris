u8R"(
$.Osiris = (function () {
  var activeTab;

  return {
    rootPanel: (function () {
      const rootPanel = $.CreatePanel('Panel', $.GetContextPanel(), 'OsirisMenuTab', {
        class: "mainmenu-content__container",
        useglobalcontext: "true"
      });

      rootPanel.visible = false;
      rootPanel.SetReadyForDisplay(false);
      rootPanel.RegisterForReadyEvents(true);
      $.RegisterEventHandler('PropertyTransitionEnd', rootPanel, function (panelName, propertyName) {
        if (rootPanel.id === panelName && propertyName === 'opacity') {
          if (rootPanel.visible === true && rootPanel.BIsTransparent()) {
            rootPanel.visible = false;
            rootPanel.SetReadyForDisplay(false);
            return true;
          } else if (newPanel.visible === true) {
            $.DispatchEvent('MainMenuTabShown', 'OsirisMenuTab');
          }
        }
        return false;
      });

      return rootPanel;
    })(),
    goHome: function () {
      $.DispatchEvent('Activated', this.rootPanel.GetParent().GetParent().GetParent().FindChildInLayoutFile("MainMenuNavBarHome"), 'mouse');
    },
    addCommand: function (command, value = '') {
      var existingCommands = this.rootPanel.GetAttributeString('cmd', '');
      this.rootPanel.SetAttributeString('cmd', existingCommands + command + ' ' + value);
    },
    navigateToTab: function (tabID) {
      if (activeTab === tabID)
        return;

      if (activeTab) {
        var panelToHide = this.rootPanel.FindChildInLayoutFile(activeTab);
        panelToHide.RemoveClass('Active');
      }

      this.rootPanel.FindChildInLayoutFile(tabID + '_button').checked = true;

      activeTab = tabID;
      var activePanel = this.rootPanel.FindChildInLayoutFile(tabID);
      activePanel.AddClass('Active');
      activePanel.visible = true;
      activePanel.SetReadyForDisplay(true);
    },
    dropDownUpdated: function (tabID, dropDownID) {
      this.addCommand('set', tabID + '/' + dropDownID + '/' + this.rootPanel.FindChildInLayoutFile(dropDownID).GetSelected().GetAttributeString('value', ''));
    }
  };
})();

(function () {
  var createNavbar = function () {
    var navbar = $.CreatePanel('Panel', $.Osiris.rootPanel, '', {
      class: "content-navbar__tabs content-navbar__tabs--noflow"
    });

    var leftContainer = $.CreatePanel('Panel', navbar, '', {
      style: "horizontal-align: left; flow-children: right; height: 100%; padding-left: 5px;"
    });

    var unloadButton = $.CreatePanel('Button', leftContainer, 'UnloadButton', {
      class: "content-navbar__tabs__btn",
      onactivate: "UiToolkitAPI.ShowGenericPopupOneOptionCustomCancelBgStyle('卸载Osiris', '你是想卸载Osiris吗?', '', '卸载', function() { $.Osiris.goHome(); $.Osiris.addCommand('unload'); }, '取消', function() {}, 'dim');"
    });

      unloadButton.SetPanelEvent('onmouseover', function () { UiToolkitAPI.ShowTextTooltip('UnloadButton', '卸载Osiris'); });
    unloadButton.SetPanelEvent('onmouseout', function () { UiToolkitAPI.HideTextTooltip(); });

    $.CreatePanel('Image', unloadButton, '', {
      src: "s2r://panorama/images/icons/ui/cancel.vsvg",
      texturewidth: "24",
      class: "negativeColor"
    });

    var centerContainer = $.CreatePanel('Panel', navbar, '', {
      class: "content-navbar__tabs__center-container",
    });

    var hudTabButton = $.CreatePanel('RadioButton', centerContainer, 'hud_button', {
      group: "SettingsNavBar",
      class: "content-navbar__tabs__btn",
      onactivate: "$.Osiris.navigateToTab('hud');"
    });

    $.CreatePanel('Label', hudTabButton, '', { text: "HUD" });

    var visualsTabButton = $.CreatePanel('RadioButton', centerContainer, 'visuals_button', {
      group: "SettingsNavBar",
      class: "content-navbar__tabs__btn",
      onactivate: "$.Osiris.navigateToTab('visuals');"
    });

    $.CreatePanel('Label', visualsTabButton, '', { text: "视觉" });
    
    var soundTabButton = $.CreatePanel('RadioButton', centerContainer, 'sound_button', {
      group: "SettingsNavBar",
      class: "content-navbar__tabs__btn",
      onactivate: "$.Osiris.navigateToTab('sound');"
    });

    $.CreatePanel('Label', soundTabButton, '', { text: "声音" });
  };

  createNavbar();

  var settingContent = $.CreatePanel('Panel', $.Osiris.rootPanel, 'SettingsMenuContent', {
    class: "full-width full-height"
  });

  var createTab = function(tabName) {
    var tab = $.CreatePanel('Panel', settingContent, tabName, {
      useglobalcontext: "true",
      class: "SettingsMenuTab"
    });

    var content = $.CreatePanel('Panel', tab, '', {
      class: "SettingsMenuTabContent vscroll"
    });
  
    return content;
  };

  var createSection = function(tab, sectionName) {
    var background = $.CreatePanel('Panel', tab, '', {
      class: "SettingsBackground"
    });

    var titleContainer = $.CreatePanel('Panel', background, '', {
      class: "SettingsSectionTitleContianer"
    });

    $.CreatePanel('Label', titleContainer, '', {
      class: "SettingsSectionTitleLabel",
      text: sectionName
    });

    var content = $.CreatePanel('Panel', background, '', {
      class: "top-bottom-flow full-width"
    });

    return content;
  };

  var createDropDown = function (parent, labelText, section, feature, options, defaultIndex = 1) {
    var container = $.CreatePanel('Panel', parent, '', {
      class: "SettingsMenuDropdownContainer"
    });

    $.CreatePanel('Label', container, '', {
      class: "half-width",
      text: labelText
    });

    var dropdown = $.CreatePanel('CSGOSettingsEnumDropDown', container, feature, {
      class: "PopupButton White",
      oninputsubmit: `$.Osiris.dropDownUpdated('${section}', '${feature}');`
    });

    for (let i = 0; i < options.length; ++i) {
      dropdown.AddOption($.CreatePanel('Label', dropdown, i, {
      value: i,
      text: options[i]
      }));
    }

    dropdown.SetSelectedIndex(defaultIndex);
    dropdown.RefreshDisplay();
  };

  var createOnOffDropDown = function (parent, labelText, section, feature) {
    createDropDown(parent, labelText, section, feature, ["On", "Off"]);
  };

  var createYesNoDropDown = function (parent, labelText, section, feature, defaultIndex = 1) {
    createDropDown(parent, labelText, section, feature, ["Yes", "No"], defaultIndex);
  };

  var hud = createTab('hud');
  var bomb = createSection(hud, '炸弹');
    createYesNoDropDown(bomb, "显示炸弹爆炸倒计时和包点", 'hud', 'bomb_timer');
  $.CreatePanel('Panel', bomb, '', { class: "horizontal-separator" });
    createYesNoDropDown(bomb, "显示拆弹倒计时", 'hud', 'defusing_alert');
  var killfeed = createSection(hud, '击杀记录');
    createYesNoDropDown(killfeed, "在回合中保存我的击杀记录", 'hud', 'preserve_killfeed');

    var visuals = createTab('visuals');

  var playerInfo = createSection(visuals, '透视');
  createDropDown(playerInfo, "启用", 'visuals', 'player_information_through_walls', ['敌人', '所有玩家', 'Off'], 2);
  $.CreatePanel('Panel', playerInfo, '', { class: "horizontal-separator" });
    createYesNoDropDown(playerInfo, "显示玩家位置", 'visuals', 'player_info_position', 0);
  $.CreatePanel('Panel', playerInfo, '', { class: "horizontal-separator" });
    createDropDown(playerInfo, "玩家位置箭头颜色", 'visuals', 'player_info_position_color', ['玩家/团队颜色', '团队颜色'], 0);
  $.CreatePanel('Panel', playerInfo, '', { class: "horizontal-separator" });
  createYesNoDropDown(playerInfo, "显示玩家血条", 'visuals', 'player_info_health', 0);
  $.CreatePanel('Panel', playerInfo, '', { class: "horizontal-separator" });
  createDropDown(playerInfo, "玩家血条字体颜色", 'visuals', 'player_info_health_color', ['基于血量', '白色'], 0);
  $.CreatePanel('Panel', playerInfo, '', { class: "horizontal-separator" });
    createYesNoDropDown(playerInfo, "显示玩家使用的武器图标", 'visuals', 'player_info_weapon', 0);
  $.CreatePanel('Panel', playerInfo, '', { class: "horizontal-separator" });
    createYesNoDropDown(playerInfo, "显示玩家使用的武器弹药数", 'visuals', 'player_info_weapon_clip', 0);
  $.CreatePanel('Panel', playerInfo, '', { class: "horizontal-separator" });
  createYesNoDropDown(playerInfo, "显示拆包图标", 'visuals', 'player_info_defuse', 0);
  $.CreatePanel('Panel', playerInfo, '', { class: "horizontal-separator" });
    createYesNoDropDown(playerInfo, '显示劫持人质图标', 'visuals', 'player_info_hostage_pickup', 0);
  $.CreatePanel('Panel', playerInfo, '', { class: "horizontal-separator" });
    createYesNoDropDown(playerInfo, '显示营救人质图标', 'visuals', 'player_info_hostage_rescue', 0);
  $.CreatePanel('Panel', playerInfo, '', { class: "horizontal-separator" });
    createYesNoDropDown(playerInfo, '显示被闪光弹致盲图标', 'visuals', 'player_info_blinded', 0);

    var sound = createTab('sound');
  
  var playerSoundVisualization = createSection(sound, '玩家声音可视化');
  $.CreatePanel('Panel', playerSoundVisualization, '', { class: "horizontal-separator" });
    createYesNoDropDown(playerSoundVisualization, "显示玩家脚步声", 'sound', 'visualize_player_footsteps');

    var bombSoundVisualization = createSection(sound, '炸弹声音可视化');
    createYesNoDropDown(bombSoundVisualization, "显示炸弹放置声音", 'sound', 'visualize_bomb_plant');
  $.CreatePanel('Panel', bombSoundVisualization, '', { class: "horizontal-separator" });
    createYesNoDropDown(bombSoundVisualization, "显示炸弹嘀嘀声", 'sound', 'visualize_bomb_beep');
  $.CreatePanel('Panel', bombSoundVisualization, '', { class: "horizontal-separator" });
    createYesNoDropDown(bombSoundVisualization, "显示拆弹声音", 'sound', 'visualize_bomb_defuse');

    var weaponSoundVisualization = createSection(sound, '武器声音可视化');
    createYesNoDropDown(weaponSoundVisualization, "显示开镜声音", 'sound', 'visualize_scope_sound');
  $.CreatePanel('Panel', weaponSoundVisualization, '', { class: "horizontal-separator" });
    createYesNoDropDown(weaponSoundVisualization, "显示换弹声音", 'sound', 'visualize_reload_sound');

  $.Osiris.navigateToTab('hud');
})();
)"
