

var dataController = (function(){
    var config = {
        'background': 'red',
        'fontsize' : '12px',
        'font' : 'Microsoft YaHei'
    }

    var defaultConfig = {
        'background': 'red',
        'fontsize' : '12px',
        'font' : 'Microsoft YaHei'
    }
    
    return{
      getConfig:function(){return config},
      setConfig:function(key,val){
        config[key] = val;
      },
      //更新数据  *
      updateConfig:function(e){
        var target,value,id;
        target = e.target;
        value = target.getAttribute('value')||target.parentNode.getAttribute('value');
        id = e.currentTarget.id;
        switch(id){
          case 'background-choice':this.setConfig('background',value);break;
          case 'fontsize-choice':this.setConfig('fontsize',value);break;
          case 'font-choice':this.setConfig('font',value);break;
        }
        return config;
      },
      store:function(){
        var currentConfig,testConfig;
        //存localStorage 需要先转成字符串
        currentConfig = JSON.stringify(this.getConfig());
        localStorage.setItem('lastConfig',currentConfig);
      },
      //刷新缓存 
      refresh:function(){
        var storage = localStorage.getItem('lastConfig');
        if(storage!=='[object Object]'&&storage!==null){
          config = JSON.parse(storage)
        }
        return config;
      },
      reset:function(){
          config = defaultConfig;
          this.store();
      }
      
    }
    
  })();
  
  var UIController = (function(){
    var colors = {
      //RED
      'darkRed':'#8E0C24',
      'lightRed':'#E74C3C',
      'lineRed':'#C9283E',
      'arrowRed':'#C7231A',
      //YELLOW
      'darkYellow':'#D09924',
      'lightYellow':'#E9DC85',
      'lineYellow':'#F2C640',
      'arrowYellow':'#FFC857'
      //GREEN
    }
    
    var palette = {
       'red':[colors.darkRed,colors.lightRed,colors.lineRed,colors.arrowRed],
       'yellow':[colors.darkYellow,colors.lightYellow,colors.lineYellow,colors.arrowYellow],
       'green':'#2E7866',
       'dark':'#1F2B40'
    }
    
    var DOMString = {
      "configList":'.config-list',
      "configSubList":'.config-sublist',
      'backgroundChoice':'#background-choice',
      'fontsizeChoice':'#fontsize-choice',
      'fontChoice':'#font-choice',
      'selected':'.selected',
      //preview structure
      'hintNavbarButton':'.hint-navbar-button',
      'line':'.hint-navbar-line',
      'sideMenuButton':'.hint-body-button',
      'rightArrow':'.fa-chevron-right',
      'leftArrow':'.hint-body-arrow',
      //font-size switcher
      'largerFont':'.hint-navbar-button',
      'smallerFont':'.hint-body-button,article',
      'preview':'.preview',
      //set buttons
      'reset':'#reset',
      'store':'#store'
    };
    return{
      //工具方法
      getDOM:function(){
        return DOMString;
      },
      //获取颜色值
      getHexCode:function(key){
        var hexCode;
        hexCode = palette[key];
        return hexCode;
      },
      //更新操作栏
      updateConfigList:function(obj){
        //选择图标透明度归0
        $('.fa-hand-o-left').css('opacity','0');
        //读取数据信息更新选择图标
        for(var key in obj){
          var selector = 'li[value="'+obj[key]+'"] .fa-hand-o-left';
          $(selector).css('opacity','1');
        }
        
      },
      //更新界面
      updateFontsize:function(key){
        var D,largerFont;
        D = DOMString;
        largerFont = (parseInt(key)+2)+'px';
        $(D.smallerFont).css('font-size',key);
        $(D.largerFont).css('font-size',largerFont);
      },
     updateFont:function(key){
        $(DOMString.preview).css('font-family',key);
      },
      updateNavButton:function(){
        
      },
      updateTheme:function(key){
        var hexCode,previewStructure,D;
        hexCode = this.getHexCode(key);
        D = DOMString;
        //预览页面结构
        previewStructure = [D.hintNavbarButton,D.line,D.sideMenuButton,D.rightArrow,D.leftArrow];
        //Hard Coding Time
        var btnGradient = '-webkit-linear-gradient(bottom,'+hexCode[0]+','+hexCode[1]+')';
        $(D.selected).css('background',btnGradient);
        $(D.line).css('background',hexCode[2]);
        $(D.sideMenuButton).hover(function(){
          $(this).siblings('div').css({
            'background':'#fff',
            'color':'#666'
          });
          $(this).css({'background':hexCode[1],
                       'color':'#fff'
                      });
        });
        $(D.rightArrow).css('color',hexCode[3]);
        var arrowGradient = '-webkit-linear-gradient(left,'+hexCode[2]+','+hexCode[0]+')'; 
        $(D.leftArrow).css('background',arrowGradient);
      },
      updatePreview:function(obj){
        var hexKey,sizeKey,fontKey;
        hexKey = obj.background;
        this.updateTheme(hexKey);
        sizeKey = obj.fontsize;
        this.updateFontsize(sizeKey);
        fontKey = obj.font;
        this.updateFont(fontKey);
      },
      loading:function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.classList.add('loading');
        e.target.classList.add('flip');
        e.target.setAttribute('disabled','disabled');
        setTimeout(function(){
          e.target.classList.remove('loading');
          e.target.classList.remove('flip');
          e.target.removeAttribute('disabled');
        },1500);
      }
      
    }
  })(); 
  
  var Controller = (function(UI,DATA){
    var DOM = UI.getDOM();
    //侧边栏控制栏滑动
    var toggleSubList = function(){
        $(DOM.configList).click(function(){
          $(this).next(DOM.configSubList).slideToggle();
        });
    }
    //初始化选择图标
    //更新界面小手
    var initIcon = function(){
      var str,selector,config;
      str = '<i class = "fa fa-hand-o-left"></i>'
      selector = DOM.configSubList+' ul li';
      $(selector).append(str);
      //直接读取配置，从后台传数据后需要调整
      config = DATA.getConfig();
      UI.updateConfigList(config);
    }
    
    //添加设置读取事件
    var initEvent = function(){
      //预览页的导航按钮切换
      $(DOM.hintNavbarButton).click(function(){
        $(this).addClass('selected').siblings('div').removeClass('selected');
      });
      //存储按钮事件
      $(DOM.store).click(function(e){
        UI.loading(e);
        DATA.store();
      });
      //还原默认按钮事件
      $(DOM.reset).click(function(){
        DATA.reset();
        var configDATA = DATA.getConfig();
        UI.updateConfigList(configDATA);
        UI.updatePreview(configDATA);
      });
      //点击选项按钮事件
      var arr = [DOM.backgroundChoice,DOM.fontsizeChoice,DOM.fontChoice];
      arr.forEach(function(val){
        $(val).click(function(e){
          var configDATA;
          configDATA = DATA.updateConfig(e);
          UI.updateConfigList(configDATA);
          UI.updatePreview(configDATA);
        });
      });
    }
    //初始化数据
    var initDATA = function(){
        var loadDATA;
        loadDATA = DATA.refresh();
        //更新预览界面
        UI.updatePreview(loadDATA);
    }
    var testData = function(){
        var t = DATA.getConfig();
        console.log(t);
    }
  
    return {
          init:function(){    
              toggleSubList();
              testData();
              initDATA();
              initIcon();
              initEvent();
          }
      };
    
  })(UIController,dataController);
  
  Controller.init();
    

  