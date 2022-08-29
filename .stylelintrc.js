module.exports = {
	extends: ['stylelint-config-standard', 'stylelint-config-rational-order'],
	plugins: ['stylelint-order', 'stylelint-declaration-block-no-ignored-properties'],
	rules: {},
	ignoreFiles: ['node_modules/**/*', 'dist/**/*', 'build/**/*'],
}
