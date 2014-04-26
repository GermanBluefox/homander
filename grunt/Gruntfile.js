/** @namespace __dirname */

module.exports = function(grunt) {

    var srcDir = __dirname + "/../";
    var dstDir = __dirname + "/../delivery/";
    var pkg    = grunt.file.readJSON('package.json');
    var iocore = grunt.file.readJSON('../io-core.json');

    // Project configuration.
    grunt.initConfig({
        pkg: pkg,
        clean: {
            all: ['.build', '.debian-pi-control', '.debian-pi-ready', '.windows-ready'],
            'debian-pi-control': ['.debian-pi-ready/DEBIAN']
        },
        replace: {
            core: {
                options: {
                    patterns: [
                        {
                            match: /settings\.version             = "[\.0-9]*";/g,
                            replacement: 'settings.version = "'+iocore.version+'";'
                        }
                    ]
                },
                files: [
                    {
                        expand:  true,
                        flatten: true,
                        src:     [srcDir + 'main.js'],
                        dest:    '.build/'
                    }
                ]
            },
            'debian-pi-version': {
                options: {
                    force: true,
                    patterns: [
                        {
                            match: 'version',
                            replacement: iocore.version
                        },
                        {
                            match: 'architecture',
                            replacement: '<%= grunt.task.current.args[2] %>'
                        },
                        {
                            match: "size",
                            replacement: '<%= grunt.task.current.args[0] %>'
                        },
                        {
                            match: "user",
                            replacement: '<%= grunt.task.current.args[1] %>'
                        }
                    ]
                },
                files: [
                    {
                        expand:  true,
                        flatten: true,
                        src:     ['debian-pi/control/*'],
                        dest:    '.debian-pi-control/control/'
                    },
                    {
                        expand:  true,
                        flatten: true,
                        src:     ['debian-pi/redeb.sh'],
                        dest:    '.debian-pi-ready/'
                    },
                    {
                        expand:  true,
                        flatten: true,
                        src:     ['debian-pi/etc/init.d/ioBroker.sh'],
                        dest:    '.debian-pi-control/'
                    }
                ]
            },
            windowsVersion: {
                options: {
                    force: true,
                    patterns: [
                        {
                            match: 'version',
                            replacement: iocore.version
                        }
                    ]
                },
                files: [
                    {
                        expand:  true,
                        flatten: true,
                        src:     ['windows/ioBroker.iss'],
                        dest:    '.windows-ready/'
                    }
                ]
            }
        },
        copy: {
            static: {
                files: [
                    {
                        expand: true,
                        cwd: srcDir,
                        src: [
                            'cert/*',
                            'doc/*',
                            'node_modules/**/*',
                            'scripts/*',
                            'www/**/*',
                            '*.json',
                            '*.js',
                            'adapter/scriptEngine/*',
                            'adapter/webServer/*',
                            'adapter/demoAdapter/*',
                            'adapter/email/*',
                            'adapter/pushover/*',
                            '!main.js',
                            '!speech.js'],
                        dest: '.build/'
                    }
                ]
            },
            'debian-pi': {
                files: [
                    {
                        expand: true,
                        cwd: '.build',
                        src: ['**/*', '!node_modules/node-windows/**/*'],
                        dest: '.debian-pi-ready/sysroot/opt/ioBroker/'
                    },
                    {
                        expand: true,
                        cwd: '.debian-pi-control/control',
                        src: ['**/*'],
                        dest: '.debian-pi-ready/DEBIAN/'
                    },
                    {
                        expand: true,
                        cwd: '.debian-pi-control/',
                        src: ['ioBroker.sh'],
                        dest: '.debian-pi-ready/sysroot/etc/init.d/'
                    }
                ]
            },
            windows: {
                files: [
                    {
                        expand: true,
                        cwd: 'windows',
                        src: ['*.js', 'v0*/**/*', '*.ico', '*.bat'],
                        dest: '.windows-ready/'
                    },
                    {
                        expand: true,
                        cwd: '.build',
                        src: ['**/*'],
                        dest: '.windows-ready/data/'
                    }
                ]
            }
        },
        // Javascript code styler
        jscs: {
            all: {
                src: [ "../*.js",
                    //"../scripts/*.js",
                    //"../adapter/**/*.js",
                    "Gruntfile.js"
                ],
                options: {
                    force: true,
                    "requireCurlyBraces": ["if","else","for","while","do","try","catch","case","default"],
                    "requireSpaceAfterKeywords": ["if","else","for","while","do","switch","return","try","catch"],
//                    "requireSpaceBeforeBlockStatements": true,
                    "requireParenthesesAroundIIFE": true,
                    "requireSpacesInFunctionExpression": {"beforeOpeningRoundBrace": true, "beforeOpeningCurlyBrace": true },
                    "requireSpacesInAnonymousFunctionExpression": {"beforeOpeningRoundBrace": true, "beforeOpeningCurlyBrace": true},
                    "requireSpacesInNamedFunctionExpression": {"beforeOpeningRoundBrace": true, "beforeOpeningCurlyBrace": true},
                    "requireSpacesInFunctionDeclaration": {"beforeOpeningRoundBrace": true, "beforeOpeningCurlyBrace": true},
                    "disallowMultipleVarDecl": true,
                    "requireBlocksOnNewline": true,
                    "disallowEmptyBlocks": true,
                    "disallowSpacesInsideObjectBrackets": true,
                    "disallowSpacesInsideArrayBrackets": true,
                    "disallowSpaceAfterObjectKeys": true,
                    "requireCommaBeforeLineBreak": true,
                    //"requireAlignedObjectValues": "all",
                    "requireOperatorBeforeLineBreak": ["?", "+", "-", "/","*", "=", "==", "===", "!=", "!==", ">", ">=", "<","<="],
                    "disallowLeftStickedOperators": ["?", "+", "-", "/", "*", "=", "==", "===", "!=", "!==", ">", ">=", "<", "<="],
                    "requireRightStickedOperators": ["!"],
                    "disallowRightStickedOperators": ["?", "+", "/", "*", ":", "=", "==", "===", "!=", "!==", ">", ">=", "<", "<="],
                    "requireLeftStickedOperators": [","],
                    "disallowSpaceAfterPrefixUnaryOperators": ["++", "--", "+", "-", "~", "!"],
                    "disallowSpaceBeforePostfixUnaryOperators": ["++", "--"],
                    "requireSpaceBeforeBinaryOperators": ["+","-","/","*","=","==","===","!=","!=="],
                    "requireSpaceAfterBinaryOperators": ["+", "-", "/", "*", "=", "==", "===", "!=", "!=="],
                    //"validateIndentation": 4,
                    //"validateQuoteMarks": { "mark": "\"", "escape": true },
                    "disallowMixedSpacesAndTabs": true,
                    "disallowKeywordsOnNewLine": true

                }
            }
        },
        // Lint
        jshint: {
            options: {
                force:true
            },
            all: [ "../*.js",
                "../scripts/*.js",
                "../adapter/**/*.js",
                "Gruntfile.js",
                '!../speech.js',
                '!../adapter/rpi/node_modules/**/*.js']
        },
        compress: {
            main: {
                options: {
                    archive: dstDir + 'ioBroker.core.' + iocore.version + '.zip'
                },
                files: [
                    {expand: true, src: ['**'],  dest: '/', cwd:'.build/'}
                ]
            },
            adapter: {
                options: {
                    archive: dstDir + '<%= grunt.task.current.args[1] %>'
                },
                files: [
                    {expand: true, src: ['**'],  dest: '/', cwd: srcDir + 'adapter/<%= grunt.task.current.args[0] %>/'}
                ]
            },
            'debian-pi-control': {
                options: {
                    archive: '.debian-pi-ready/control.tar.gz'
                },
                files: [
                    {
                        expand: true,
                        src: ['**/*'],
                        dest: '/',
                        cwd: '.debian-pi-control/control/'
                    }
                ]
            },
            'debian-pi-data': {
                options: {
                    archive: '.debian-pi-ready/data.tar.gz'
                },
                files: [
                    {
                        expand: true,
                        src: ['**/*'],
                        dest: '/',
                        cwd: '.debian-pi-ready/sysroot/'
                    }
                ]
            }
        },
        command : {
            makeWindowsMSI: {
               // type : 'bat',
                cmd  :'"'+__dirname+'\\windows\\InnoSetup5\\ISCC.exe" "'+__dirname+'\\.windows-ready\\ioBroker.iss" > "'+__dirname+'\\.windows-ready\\setup.log"'
            }
        },


		// Used for build repository
        'unzip': {
            // Skip/exclude files via `router`
            unzipIo: {
                // If router returns a falsy varaible, the file will be skipped
                router: function (filepath) {
                    if (filepath.indexOf('io-addon.json') != -1 || filepath.indexOf('io-core.json') != -1 || filepath.indexOf('io-adapter.json') != -1) {
                        return filepath;
                    } else {
                        // Otherwise, skip it
                        return null;
                    }
                },
                src: [dstDir + '/<%= grunt.task.current.args[0] %>'],
                dest: '.rep-work/<%= grunt.task.current.args[1] %>/'
            }
        }
    });

    grunt.registerTask('buildAllAdapters', function () {
        var dirs = {};
        grunt.file.recurse(srcDir + "/adapter/", function (abspath, rootdir, subdir, filename) {
            if (subdir.indexOf('/') != -1) {
                if (!dirs[subdir]) {
                    dirs[subdir] = {};
                }
            } else if (filename == 'Gruntfile.js') {
                if (!dirs[subdir]) {
                    dirs[subdir] = {};
                }
                dirs[subdir].grunt = true;
            }else if (filename == 'io-adapter.json') {
                if (!dirs[subdir]) {
                    dirs[subdir] = {};
                }
                dirs[subdir].packet = true;
            }
        });
        for (var t in dirs) {
            if (!dirs[t].grunt && dirs[t].packet) {
                console.log (srcDir + 'adapter/' + t + '/io-adapter.json');
                var adp = grunt.file.readJSON(srcDir + 'adapter/' + t + '/io-adapter.json');
                console.log(adp.name + adp.version);
                grunt.task.run(['compress:adapter:'+ t + ':ioBroker.adapter.' + adp.ident + '.' + adp.version +'.zip']);
                grunt.file.copy(srcDir + 'adapter/' + t + '/io-adapter.json', dstDir + '/ioBroker.adapter.' + adp.ident + '.' + adp.version + '.json');
            } else
            if (dirs[t].grunt) {
                // Start gruntfile
            }
        }
    });

    // --------------------- REPOSITORY START ------------------------------//
    // Objects for repository

    var repObject  = {
        cores: {},
        addons: {},
        adapters: {},
        installs: {}
    };
    var repMain;
    var repositoryDir = dstDir;

    function translate (text, lang) {
        lang = lang || 'en';
        if (!this.words) {
            this.words = {
                'Adapters'            : {'en': 'Adapters',           'de': 'Adapters',             'ru': 'Драйвера'},
                'Add-ons'             : {'en': 'Add-ons',            'de': 'Add-ons',              'ru': 'Модули'},
                'Core'                : {'en': 'Core updates',       'de': 'Updates für Kern',     'ru': 'Обновления ядра'},
                'Install'             : {'en': 'Install packets',    'de': 'Installationspakete',  'ru': 'Файлы для инсталляции'},
                'ioBroker Repository' : {'en': 'ioBroker Downloads', 'de': 'ioBroker Downloads.',  'ru': 'Модули для ioBroker'}
            };
        }
        if (this.words[text]) {
            var newText = this.words[text][lang];
            if (newText){
                return newText;
            }
            else
            if (lang != 'en') {
                newText = this.words[text]['en'];
                if (newText){
                    return newText;
                }
            }

        }
        //console.log ("trans: " + text);
        return text;
    }

    grunt.registerTask('createRepository', function () {
        if (grunt.file.exists(repositoryDir + '/io-repository.json')) {
            repMain = grunt.file.readJSON (repositoryDir + '/io-repository.json');
        } else {
            console.log('no ' +  repositoryDir + '/io-repository.json found. Cannot create repository');
            return;
        }

        grunt.file.recurse (repositoryDir, function (abspath, rootdir, subdir, filename) {
            // Unpack
            if (filename.indexOf('.zip') != -1) {
                var parts = filename.split('.');
                parts.splice(parts.length - 1, 1);
                var tmpDir = parts.join('.');
                // Check if json description file exists for this packet
                if (grunt.file.exists(repositoryDir +'/' + tmpDir + '.json')) {
                    grunt.task.run(['jsonInfo:'+tmpDir]);
                } else {
                    grunt.task.run(['unzip:unzipIo:'+filename+':'+tmpDir]);
                    grunt.task.run(['assembleInfo:'+tmpDir]);
                }
            } else if (filename.indexOf('.deb') != -1 || filename.indexOf('.exe') != -1) {
                grunt.task.run(['packetInfo:'+filename]);
            }
        });
        for (var i = 0; i < repMain.languages.length; i++) {
            grunt.task.run(['writeRepository:' + repMain.languages[i]]);
        }
    });

    grunt.registerTask('packetInfo', function () {
        // Try to extract from the file name the version and packet type ioBroker-pi.2.0.0.deb or ioBrokerInstaller.2.0.0.exe
        var parts = grunt.task.current.args[0].split('.');
        var i = 0;
        var ver = -1;
        var version = "";
        while (i < parts.length) {
            if (parts[i].length == 0) {
                i++;
                continue;
            }
            if (parts[i][0] >= '0' && parts[i][0] <= '9') {
                version += ((version) ? '.' : '') + parts[i];
                ver++;
            } else if (ver >= 0) {
                break;
            }
            i++;
        }

        if (grunt.task.current.args[0].indexOf('.exe') != -1) {
            if (!repObject.installs.windows){
                repObject.installs.windows = {name: 'Windows x86 x64',
                    description: {
                        'en' : "Windows installer for ioBroker",
                        'de' : "Windows installer für ioBroker",
                        'ru' : "Windows installer для ioBroker"
                    },
                    versions: {}
                };
            }
            repObject.installs.windows.versions[version] = {name: 'ioBroker Windows installer',
                description: {
                    'en' : "Windows installer for ioBroker",
                    'de' : "Windows installer für ioBroker",
                    'ru' : "Windows installer для ioBroker"
                }
            };
            repObject.installs.windows.versions[version].urlDownload = repMain.link + '/' + grunt.task.current.args[0];
        } else
        if (grunt.task.current.args[0].indexOf('.deb') != -1) {
            if (!repObject.installs.pi){
                repObject.installs.pi = {name: 'Raspbian on Raspberry PI',
                    description: {
                        'en' : "Installation package ioBroker for Raspberry PI",
                        'de' : "Installation Paket ioBroker für Raspberry PI",
                        'ru' : "ioBroker для Raspberry PI"
                    },
                    versions: {}
                };
            }
            repObject.installs.pi.versions[version] = {name: 'ioBroker for Raspberry PI',
                description: {
                    'en' : "Installation package ioBroker for Raspberry PI",
                    'de' : "Installation Paket ioBroker für Raspberry PI",
                    'ru' : "ioBroker для Raspberry PI"
                }
            };
            repObject.installs.pi.versions[version].urlDownload = repMain.link + '/' + grunt.task.current.args[0];
        }
    });

    grunt.registerTask('assembleInfo', function () {
        var ioInfo;
        if (grunt.file.exists('.rep-work/' + grunt.task.current.args[0] + '/io-addon.json')) {
            ioInfo = grunt.file.readJSON('.rep-work/'+grunt.task.current.args[0] + '/io-addon.json');
            if (!repObject.addons[ioInfo.name]) {
                repObject.addons[ioInfo.name] = {};
            }
            repObject.addons[ioInfo.name][ioInfo.version] = ioInfo;
            repObject.addons[ioInfo.name][ioInfo.version].urlDownload = repMain.link + '/' + grunt.task.current.args[0]+".zip";
        } else
        if (grunt.file.exists('.rep-work/'+grunt.task.current.args[0] + '/io-adapter.json')) {
            ioInfo = grunt.file.readJSON('.rep-work/'+grunt.task.current.args[0] + '/io-adapter.json');
            if (!repObject.adapters[ioInfo.name]) {
                repObject.adapters[ioInfo.name] = {};
            }
            repObject.adapters[ioInfo.name][ioInfo.version] = ioInfo;
            repObject.adapters[ioInfo.name][ioInfo.version].urlDownload = repMain.link + '/' + grunt.task.current.args[0]+".zip";
        }else
        if (grunt.file.exists('.rep-work/'+grunt.task.current.args[0] + '/io-core.json')) {
            ioInfo = grunt.file.readJSON('.rep-work/'+grunt.task.current.args[0] + '/io-core.json');
            repObject.cores[ioInfo.version] = ioInfo;
            repObject.cores[ioInfo.version].urlDownload = repMain.link + '/' + grunt.task.current.args[0]+".zip";
        }
        grunt.file.write(repositoryDir + '/' + grunt.task.current.args[0] + '.json', JSON.stringify(ioInfo, null,'\t'));
        grunt.file.delete('.rep-work/' + grunt.task.current.args[0] + '/');
    });

    grunt.registerTask('jsonInfo', function () {
        var ioInfo = grunt.file.readJSON(repositoryDir + '/'+grunt.task.current.args[0] + '.json');
        if (grunt.task.current.args[0].indexOf('.addon.') != -1) {
            if (!repObject.addons[ioInfo.name]) {
                repObject.addons[ioInfo.name] = {};
            }
            repObject.addons[ioInfo.name][ioInfo.version] = ioInfo;
            repObject.addons[ioInfo.name][ioInfo.version].urlDownload = repMain.link + '/' + grunt.task.current.args[0]+".zip";
        } else
        if (grunt.task.current.args[0].indexOf('.adapter.') != -1) {
            if (!repObject.adapters[ioInfo.name]) {
                repObject.adapters[ioInfo.name] = {};
            }
            repObject.adapters[ioInfo.name][ioInfo.version] = ioInfo;
            repObject.adapters[ioInfo.name][ioInfo.version].urlDownload = repMain.link + '/' + grunt.task.current.args[0]+".zip";
        }else
        if (grunt.task.current.args[0].indexOf('.core.') != -1) {
            repObject.cores[ioInfo.version] = ioInfo;
            repObject.cores[ioInfo.version].urlDownload = repMain.link + '/' + grunt.task.current.args[0]+".zip";
        }
    });

    function createDescription (infoObj, lang) {
        lang = lang || 'en';
        var desc;
        if (infoObj.description) {
            if (infoObj.description[lang]) {
                desc = infoObj.description[lang];
            } else if (infoObj.description['en']) {
                desc = infoObj.description['en'];
            } else {
                desc = infoObj.description;
            }
        } else {
            desc = infoObj.name;
        }

        return '<p>' +desc+ '</p>';
    }

    grunt.registerTask('writeRepository', function () {
        var lang = grunt.task.current.args[0] || 'en';
        var text = '<html><header><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>' +
            '<link rel="stylesheet" href="repository.css" type="text/css"/></header>' +
            '<body><h1>'+(repMain.name[lang] || repMain.name)+'</h1>\n';

        if (repMain.description) {
            text += createDescription(repMain, lang);
        }

        // Install packets
        var headerAdded = false;
        for (var os_platform in repObject.installs) {
            if (!headerAdded) {
                text += '<h2>'+translate('Install', lang)+'</h2>\n';
                headerAdded = true;
            }

            text += '<h3>' + (repObject.installs[os_platform].name || os_platform) + '</h3>\n';
            for (var ver in repObject.installs[os_platform].versions) {
                text += '<tr><td><a href="'+repObject.installs[os_platform].versions[ver].urlDownload +'">'+ver+'</a></td></td>\n';
            }
        }

        // Update cores
        headerAdded = false;
        for (var ver in repObject.cores) {
            if (!headerAdded) {
                text += '<h2>'+translate('Core', lang)+'</h2>\n';
                text += createDescription(repObject.cores[ver], lang);
                text += "<table>\n";
                headerAdded = true;
            }
            text += '<tr><td><a href="'+repObject.cores[ver].urlDownload +'">'+ver+'</a></td></td>\n';
        }
        if (headerAdded) {
            text += "</table>\n";
        }

        // Addons
        headerAdded = false;
        for (var addon in repObject.addons) {
            if (!headerAdded) {
                text += '<h2>'+translate('Add-ons', lang)+'</h2>\n';
                headerAdded = true;
            }

            text += '<h3>'+addon+'</h3>\n';
            var headerAdded2 = false;
            for (var ver in repObject.addons[addon]) {
                if (!headerAdded2) {
                    text += createDescription(repObject.addons[addon][ver], lang);
                    headerAdded2 = true;
                    text += "<table>\n";
                }

                text += '<tr><td><a href="'+repObject.addons[addon][ver].urlDownload +'">'+ver+'</a></td></td>\n';
            }
            if (headerAdded2) {
                text += "</table>\n";
            }
        }

        // Adapters
        headerAdded = false;
        for (var adapter in repObject.adapters) {
            if (!headerAdded) {
                text += '<h2>'+translate('Adapters', lang)+'</h2>';
                headerAdded = true;
            }

            text += '<h3>'+adapter+'</h3>';
            var headerAdded2 = false;
            for (var ver in repObject.adapters[adapter]) {
                if (!headerAdded2) {
                    text += createDescription(repObject.adapters[adapter][ver], lang);
                    headerAdded2 = true;
                    text += "<table>";
                }

                text += '<tr><td><a href="'+repObject.adapters[adapter][ver].urlDownload +'">'+ver+'</a></td></td>\n';
            }
            if (headerAdded2) {
                text += "</table>";
            }
        }
        text += '</body></html>';
        grunt.file.write (repositoryDir + '/' + repMain.htmlFile + '-' + lang + '.html', text);
        if (!repMain.jsonCreated) {
            repMain.repository = repObject;
            grunt.file.write (repositoryDir + '/' + repMain.jsonFile + '.json', JSON.stringify(repMain, null, '\t'));
            repMain.jsonCreated= true;
        }
    });
    grunt.registerTask('rep', ['createRepository']);

    // ----------------------------- REPOSITORY END --------------------------- //
	
	
	
	
	
    grunt.registerTask('makeEmptyDirs', function () {
        grunt.file.mkdir('.build/log');
        grunt.file.mkdir('.build/datastore');
        grunt.file.mkdir('.build/tmp');
    });


    var writeVersions = {
        name: "writeVersions",
        list: [
            'replace:core'
        ]
    };

    var gruntTasks = [
        'grunt-replace',
        'grunt-contrib-clean',
        'grunt-contrib-concat',
        'grunt-contrib-copy',
        'grunt-contrib-compress',
        'grunt-contrib-commands',
        'grunt-contrib-jshint',
        'grunt-jscs-checker',
        'grunt-zip'
    ];
    var i;

    for (i in gruntTasks) {
        grunt.loadNpmTasks(gruntTasks[i]);
    }

    grunt.registerTask('debian-pi-packet', function () {
        // Calculate size of directory
        var fs = require('fs'),
            path = require('path');

        function readDirSize(item) {
            var stats = fs.lstatSync(item);
            var total = stats.size;

            if (stats.isDirectory()) {
                var list = fs.readdirSync(item);
                for (var i = 0; i < list.length; i++) {
                    total += readDirSize(path.join(item, list[i]));
                }
                return total;
            }
            else {
                return total;
            }
        }

        var size = readDirSize('.build');

        grunt.task.run([
            'replace:debian-pi-version:' + (Math.round(size / 1024) + 8) + ':pi:armhf', // Settings for raspbian
            'copy:debian-pi',
            //'compress:debian-pi-data',
            'compress:debian-pi-control',
            'clean:debian-pi-control'
        ]);
        console.log('========= Copy .debian-pi-ready directory to Raspbery PI and start "sudo bash redeb.sh" =============');
    });

    grunt.registerTask('windows-msi', function () {
         if (/^win/.test(process.platform)) {
             grunt.task.run([
                 'copy:windows',
                 'replace:windowsVersion',
                 'command:makeWindowsMSI'
             ]);
             console.log('========= Please wait a little (ca 1 min). The msi file will be created in ioBroker/delivery directory after the grunt is finished.');
             console.log('========= you can start batch file .windows-ready\\createSetup.bat manually');
             // Sometimes command:makeWindowsMSI does not work, you can start batch file manually
             grunt.file.write(__dirname + '\\.windows-ready\\createSetup.bat', '"' + __dirname + '\\windows\\InnoSetup5\\ISCC.exe" "' + __dirname + '\\.windows-ready\\ioBroker.iss"');
         } else {
            console.log('Cannot create windows setup, while host is not windows');
         }
    });

    grunt.registerTask('createJsonInfo', function () {
        grunt.file.copy(srcDir + '/io-core.json', dstDir + '/ioBroker.core.' + iocore.version + '.json');
    });

    grunt.registerTask('default', [
//        'jshint',
//        'jscs',
        'clean:all',
        'replace:core',
        'makeEmptyDirs',
        'copy:static',
        'compress:main',
        'createJsonInfo',
        'buildAllAdapters',
        'debian-pi-packet',
        'windows-msi'
    ]);
};