module.exports = function (config)
{
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('karma-teamcity-reporter'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            jasmine: {
                // you can add configuration options for Jasmine here
                // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
                // for example, you can disable the random execution with `random: false`
                // or set a specific seed with `seed: 4321`
            },
            clearContext: false
        },
        jasmineHtmlReporter: {
            suppressAll: true
        },
        coverageReporter: {
            dir: require('path').join(__dirname, './coverage/'),
            subdir: '.',
            reporters: [
                { type: 'teamcity' },
                { type: 'html' }
            ],
            fixWebpackSourcePaths: true,
            check: {
                global: {
                    statements: 10,
                    branches: 10,
                    functions: 10,
                    lines: 10
                }
            }
        },
        reporters: ['teamcity'],
        browsers: ['ChromeHeadless'],
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        singleRun: true
    });
};
