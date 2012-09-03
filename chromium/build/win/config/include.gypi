{
  'target_defaults': {
    'configurations': {
      'x86_Base': {
        'msvs_settings': {
          'VCLinkerTool': {
            'AdditionalLibraryDirectories': [
              '$(WDK_DIR)/lib/ATL/i386',
            ],
          },
          'VCLibrarianTool': {
            'AdditionalLibraryDirectories': [
              '$(WDK_DIR)/lib/ATL/i386',
            ],
          },
        },
      },
      'x64_Base': {
        'msvs_settings': {
          'VCLibrarianTool': {
            'AdditionalLibraryDirectories': [
              '$(WDK_DIR)/lib/ATL/amd64',
            ],
          },
          'VCLinkerTool': {
            'AdditionalLibraryDirectories': [
              '$(WDK_DIR)/lib/ATL/amd64',
            ],
          },
        },
      },
    },
    'msvs_system_include_dirs': [
      '$(WDK_DIR)/inc/atl71',
      '$(WDK_DIR)/inc/mfc42',
    ],
  },
}