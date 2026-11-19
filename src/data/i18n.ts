import type { AssetCategory, Language, LegalTrack, Relationship } from '../types';

export const msDict = {
  'app.name': 'WarisReady',
  'app.tagline': 'Rancang Hari Ini, Lindungi Esok.',
  'app.demoBanner': 'Mod Demo — Maklumat disimpan dalam pelayar peranti ini sahaja.',
  'app.demoNotice':
    'Mod Demo — Maklumat disimpan dalam pelayar peranti ini sahaja. Jangan masukkan maklumat perbankan atau dokumen sulit sebenar.',
  'app.storageNotice':
    'Maklumat ini tidak disegerakkan atau disulitkan sebagai simpanan arkib. Data boleh hilang apabila pelayar atau storan dipadamkan. Gunakan data rekaan untuk demonstrasi.',
  'app.ariaMainNav': 'Navigasi utama',
  'app.ariaMenu': 'Buka menu navigasi',

  'common.save': 'Simpan',
  'common.cancel': 'Batal',
  'common.close': 'Tutup',
  'common.edit': 'Edit',
  'common.delete': 'Padam',
  'common.confirm': 'Teruskan',
  'common.optional': 'Pilihan',
  'common.dismiss': 'Tutup',
  'common.storageError': 'Data tidak dapat disimpan pada pelayar ini.',
  'common.required': 'Diperlukan',

  'language.label': 'Bahasa',
  'language.switch': 'Tukar bahasa',

  'nav.menu': 'Menu',
  'nav.dashboard': 'Dashboard',
  'nav.assets': 'Aset',
  'nav.family': 'Keluarga',
  'nav.readiness': 'Kesediaan',
  'nav.learn': 'Ilmu Pusaka',
  'nav.summary': 'Ringkasan',

  'warn.corrupt':
    'Data tersimpan tidak dapat dibaca. Aplikasi bermula dengan profil kosong dan tidak menulis ganti data lama secara automatik.',
  'warn.normalized':
    'Sebahagian data tersimpan tidak sah dan telah dibetulkan secara automatik.',
  'warn.storage':
    'Storan pelayar tidak tersedia. Perubahan tidak akan kekal selepas halaman dimuat semula.',

  'demo.load': 'Muatkan Data Demo',
  'demo.reset': 'Kosongkan Data',
  'demo.dialogTitle': 'Muatkan Data Demo',
  'demo.dialogDesc':
    'Pilih persona demo. Memuatkan persona akan menggantikan semua data semasa dan mengekalkan bahasa aktif.',
  'demo.replaceTitle': 'Ganti data semasa?',
  'demo.replaceConfirm':
    'Profil semasa mengandungi data. Muatkan persona ini dan ganti semua data semasa?',
  'demo.resetTitle': 'Kosongkan semua data?',
  'demo.resetDesc': 'Semua data dalam pelayar ini akan dipadam. Teruskan?',
  'demo.loaded': 'Data demo {name} dimuatkan.',
  'demo.resetDone': 'Semua data telah dipadam.',
  'demo.personaMeta': '{track} · {assets} aset · {contacts} kontak · {score}%',

  'dashboard.welcome': 'Selamat Datang',
  'dashboard.welcomeBrand': 'Selamat Datang ke WarisReady',
  'dashboard.question': 'Adakah keluarga anda bersedia sekiranya berlaku kecemasan?',
  'dashboard.nameLabel': 'Nama Paparan',
  'dashboard.namePlaceholder': 'Nama anda',
  'dashboard.nameSaved': 'Nama berjaya disimpan.',
  'dashboard.metricValue': 'Jumlah Nilai Anggaran',
  'dashboard.metricAssets': 'Bilangan Aset',
  'dashboard.metricContacts': 'Bilangan Kontak Keluarga',
  'dashboard.metricScore': 'Skor Kesediaan',
  'dashboard.ctaReadiness': 'Lengkapkan Persediaan',
  'dashboard.ctaSummary': 'Lihat Ringkasan Kecemasan',
  'dashboard.incomplete': 'Tugasan Belum Selesai',
  'dashboard.recentAssets': 'Aset Terkini',
  'dashboard.viewAll': 'Lihat Semua',
  'dashboard.trackLabel': 'Trek perundangan:',
  'dashboard.trackChange': 'Tukar',
  'dashboard.trackNote': 'Trek hanya mempengaruhi kandungan pembelajaran, bukan skor atau data anda.',
  'dashboard.setupTitle': 'Pilih trek perundangan anda',
  'dashboard.setupDesc':
    'Trek membantu kami memaparkan panduan pusaka yang sesuai. Ia tidak menjejaskan skor, aset atau kontak anda.',
  'dashboard.setupSkip': 'Nanti sahaja',
  'dashboard.noIncomplete': 'Semua tugasan telah selesai.',
  'dashboard.addFirstAsset': 'Tambah Aset',
  'dashboard.addFirstContact': 'Tambah Kontak',

  'status.complete': 'Senarai Semak Lengkap',
  'status.almost': 'Hampir Lengkap',
  'status.inProgress': 'Dalam Persediaan',
  'status.notReady': 'Belum Bersedia',

  'asset.title': 'Kenali Harta Anda',
  'asset.subtitle':
    'Rekod maklumat asas aset supaya keluarga tahu di mana untuk bermula.',
  'asset.totalLabel': 'Jumlah Nilai Anggaran (Indikatif)',
  'asset.add': 'Tambah Aset',
  'asset.addFirst': 'Tambah Aset Pertama',
  'asset.empty': 'Belum ada aset direkodkan.',
  'asset.emptyFiltered': 'Tiada aset sepadan dengan carian.',
  'asset.clearFilter': 'Kosongkan Penapis',
  'asset.searchPlaceholder': 'Cari nama atau institusi',
  'asset.allCategories': 'Semua Kategori',
  'asset.fieldName': 'Nama Aset',
  'asset.fieldCategory': 'Kategori',
  'asset.fieldInstitution': 'Institusi / Bank',
  'asset.fieldValue': 'Nilai Anggaran (RM)',
  'asset.fieldDocLocation': 'Lokasi Dokumen',
  'asset.fieldNotes': 'Catatan',
  'asset.formAddTitle': 'Tambah Aset',
  'asset.formEditTitle': 'Edit Aset',
  'asset.saved': 'Aset berjaya disimpan.',
  'asset.deleted': 'Aset berjaya dipadam.',
  'asset.deleteTitle': 'Padam aset ini?',
  'asset.deleteDesc': 'Aset “{name}” akan dipadam secara kekal.',
  'asset.institutionPlaceholder': 'Contoh: Bank Demo, ASNB',
  'asset.docLocationPlaceholder': 'Contoh: Fail Biru di Rumah',
  'asset.notesPlaceholder': 'Catatan tambahan (pilihan)',
  'asset.count': '{count} aset',

  'family.title': 'Orang Tersayang',
  'family.add': 'Tambah Kontak',
  'family.empty': 'Belum ada kontak keluarga direkodkan.',
  'family.primary': 'Kontak Utama',
  'family.primaryShort': 'Utama',
  'family.fieldName': 'Nama',
  'family.fieldRelationship': 'Hubungan',
  'family.fieldPhone': 'Nombor Telefon',
  'family.fieldPrimary': 'Jadikan Kontak Kecemasan Utama',
  'family.formAddTitle': 'Tambah Kontak',
  'family.formEditTitle': 'Edit Kontak',
  'family.saved': 'Kontak berjaya disimpan.',
  'family.deleted': 'Kontak berjaya dipadam.',
  'family.deleteTitle': 'Padam kontak ini?',
  'family.deleteDesc': 'Kontak “{name}” akan dipadam secara kekal.',
  'family.phonePlaceholder': 'Contoh: 012-3456789',
  'family.namePlaceholder': 'Nama penuh',
  'family.count': '{count} kontak',
  'family.disclaimer':
    'Senarai ini adalah untuk rujukan dan hubungan kecemasan. Ia bukan pengesahan waris yang berhak menerima pusaka.',

  'readiness.title': 'Sejauh Mana Anda Bersedia?',
  'readiness.completed': '{done} daripada 5 selesai',
  'readiness.autoAssessed': 'Dinilai secara automatik',
  'readiness.manual': 'Pengesahan manual',
  'readiness.reviewNote':
    'Pengakuan ini bermaksud “Saya telah menyemak”, bukan “Saya memiliki dokumen sah”.',
  'readiness.reviewSummary': 'Semak Ringkasan',
  'readiness.disclaimer':
    'Skor ini hanya menunjukkan tahap kelengkapan persediaan dan bukan pengesahan sah sesuatu dokumen atau pengaturan pusaka.',
  'readiness.points': '{points} mata',

  'task.assets.label': 'Rekod sekurang-kurangnya satu aset',
  'task.assets.desc': 'Tambah aset pertama anda dalam inventori.',
  'task.family.label': 'Rekod sekurang-kurangnya satu ahli keluarga / kontak',
  'task.family.desc': 'Tambah sekurang-kurangnya seorang ahli keluarga atau kontak kecemasan.',
  'task.documents.label': 'Saya telah menyemak lokasi dokumen penting',
  'task.documents.desc': 'Anda telah menyemak di mana dokumen penting disimpan.',
  'task.planning.label': 'Saya telah menyemak keperluan Hibah, Wasiat atau penamaan',
  'task.planning.desc': 'Anda telah menyemak keperluan Hibah, Wasiat atau penamaan.',
  'task.emergency.label': 'Saya telah menyemak ringkasan kecemasan keluarga',
  'task.emergency.desc': 'Semak ringkasan kecemasan, kemudian sahkan semakan di halaman ringkasan.',

  'learn.title': 'Ilmu Pusaka Untuk Semua',
  'learn.subtitle': 'Panduan umum mengikut trek perundangan anda.',
  'learn.whyLabel': 'Mengapa penting',
  'learn.tipLabel': 'Tip praktikal',
  'learn.officialLink': 'Buka sumber rasmi',
  'learn.generalDisclaimer':
    'Kandungan ini adalah untuk tujuan pendidikan umum sahaja dan bukan nasihat undang-undang.',
  'learn.trackHeading': 'Panduan untuk trek: {track}',
  'learn.groupMuslim': 'Panduan trek Muslim',
  'learn.groupNonMuslim': 'Panduan trek bukan Muslim',
  'learn.nativeNote':
    'Negeri {state} mempunyai rejim undang-undang anak negeri yang tersendiri. Jika berkaitan, pertimbangkan trek adat anak negeri.',
  'learn.localLawWarning':
    'Wills Act 1959 dan Distribution Act 1958 terpakai di Semenanjung Malaysia sahaja. Sabah dan Sarawak mempunyai rejim undang-undang berasingan.',
  'learn.nativeStatePrompt':
    'Trek adat anak negeri memerlukan negeri Sabah atau Sarawak. Sila pilih negeri anda di bawah.',
  'learn.adviceTitle': 'Dapatkan nasihat profesional',
  'learn.adviceBody':
    'WarisReady bukan penasihat undang-undang. Untuk keputusan pewarisan, wasiat, hibah atau adat, rujuk peguam, penasihat syariah, Amanah Raya, atau pihak berkuasa negeri yang berkaitan.',
  'learn.bodyFallback': 'Panduan penuh tersedia dalam Bahasa Melayu.',

  'learn.card.faraid.title': 'Faraid',
  'learn.card.faraid.intro':
    'Faraid ialah pembahagian harta pusaka orang Islam mengikut kadar yang ditetapkan syarak selepas wasiat dan hutang diselesaikan.',
  'learn.card.faraid.why':
    'Memahami asasnya membantu keluarga mengenal pasti pihak yang terlibat dan dokumen yang perlu disediakan, tanpa perlu mengira bahagian sendiri.',
  'learn.card.faraid.tip':
    'Senaraikan aset, hutang dan dokumen pemilikan di satu tempat supaya keluarga mudah merujuk.',

  'learn.card.wasiat.title': 'Wasiat (satu pertiga)',
  'learn.card.wasiat.intro':
    'Wasiat ialah pesanan tentang harta selepas kematian; bagi orang Islam, wasiat kepada bukan waris lazimnya terhad kepada satu pertiga daripada harta.',
  'learn.card.wasiat.why':
    'Mengetahui had ini mengelakkan salah faham keluarga tentang bahagian yang boleh diwasiatkan.',
  'learn.card.wasiat.tip':
    'Rujuk penasihat syariah bertauliah sebelum menyediakan atau meminda wasiat.',

  'learn.card.hibah.title': 'Hibah, Waqaf dan Amanah Khairat',
  'learn.card.hibah.intro':
    'Hibah ialah pemberian harta semasa hidup, manakala waqaf dan amanah khairat menyalurkan manfaat untuk tujuan kebajikan atau keluarga.',
  'learn.card.hibah.why':
    'Setiap instrumen mempunyai syarat dan kesan berbeza, jadi fahami dahulu sebelum membuat keputusan.',
  'learn.card.hibah.tip':
    'Simpan salinan surat hibah atau amanah di tempat selamat dan beritahu keluarga di mana ia disimpan.',

  'learn.card.takaful.title': 'Takaful dan penamaan KWSP',
  'learn.card.takaful.intro':
    'Penamaan takaful dan KWSP memudahkan proses tuntutan manfaat oleh keluarga, tetapi ia bukan penentuan hak pusaka di bawah Faraid.',
  'learn.card.takaful.why':
    'Penamaan yang lapuk boleh menyukarkan tuntutan; semak semula selepas perubahan besar dalam keluarga.',
  'learn.card.takaful.tip':
    'Semak penamaan anda secara berkala dan simpan salinan penyata terkini.',

  'learn.card.wills.title': 'Wills Act 1959',
  'learn.card.wills.intro':
    'Di Semenanjung Malaysia, Wills Act 1959 menetapkan cara wasiat yang sah dibuat, termasuk keperluan umur, tandatangan dan saksi.',
  'learn.card.wills.why':
    'Wasiat yang sah membantu mengelakkan kekeliruan dan kelewatan dalam pengurusan harta.',
  'learn.card.wills.tip':
    'Simpan wasiat asal di tempat selamat dan maklumkan kepada wasi atau keluarga yang dipercayai.',

  'learn.card.intestacy.title': 'Intestasi: Distribution Act 1958',
  'learn.card.intestacy.intro':
    'Jika tiada wasiat, Distribution Act 1958 (Semenanjung Malaysia) menentukan bagaimana harta dibahagikan kepada waris.',
  'learn.card.intestacy.why':
    'Memahami peraturan ini membantu keluarga menjangka proses yang perlu dilalui.',
  'learn.card.intestacy.tip':
    'Simpan salinan surat nikah, surat kelahiran dan dokumen keluarga di tempat yang mudah ditemui.',

  'learn.card.probate.title': 'Probet dan surat kuasa mentadbir',
  'learn.card.probate.intro':
    'Wasiat memerlukan probet, manakala harta tanpa wasiat memerlukan surat kuasa mentadbir sebelum harta boleh diagihkan.',
  'learn.card.probate.why':
    'Mengetahui dokumen ini lebih awal mengurangkan kelewatan ketika keluarga sedang bersedih.',
  'learn.card.probate.tip':
    'Catat nama institusi dan lokasi dokumen supaya proses permohonan lebih cepat.',

  'learn.card.epf.title': 'Penamaan KWSP, insurans dan amanah',
  'learn.card.epf.intro':
    'Penamaan KWSP dan insurans memudahkan pembayaran manfaat, manakala amanah boleh membantu mengurus harta untuk benefisiari.',
  'learn.card.epf.why':
    'Tanpa penamaan atau perancangan, keluarga mungkin menghadapi proses tuntutan yang lebih panjang.',
  'learn.card.epf.tip':
    'Semak penamaan anda dan pertimbangkan nasihat profesional untuk sebarang amanah.',

  'learn.card.ncr.title': 'Tanah NCR (hak adat anak negeri)',
  'learn.card.ncr.intro':
    'Hak adat anak negeri (NCR) di Sabah dan Sarawak berbeza daripada hak milik berdaftar biasa dan bergantung kepada undang-undang negeri.',
  'learn.card.ncr.why':
    'Salah faham tentang status tanah boleh melambatkan urusan keluarga.',
  'learn.card.ncr.tip':
    'Dapatkan pengesahan status tanah daripada pejabat tanah negeri yang berkaitan.',

  'learn.card.nativeCourt.title': 'Mahkamah Anak Negeri',
  'learn.card.nativeCourt.intro':
    'Bagi komuniti anak negeri, Mahkamah Anak Negeri mengendalikan permohonan surat kuasa mentadbir untuk harta pusaka tertentu.',
  'learn.card.nativeCourt.why':
    'Proses dan bidang kuasa berbeza antara negeri dan komuniti.',
  'learn.card.nativeCourt.tip':
    'Tanya pejabat daerah atau Mahkamah Anak Negeri tempatan tentang langkah pertama.',

  'learn.card.landSuccession.title': 'Pewarisan tanah Sabah dan Sarawak',
  'learn.card.landSuccession.intro':
    'Proses pewarisan tanah di Sabah dan Sarawak berbeza antara kedua negeri serta antara komuniti.',
  'learn.card.landSuccession.why':
    'Setiap negeri mempunyai prosedur dan borang tersendiri.',
  'learn.card.landSuccession.tip':
    'Simpan geran, resit cukai tanah dan dokumen keluarga bersama.',

  'learn.card.nativeDocs.title': 'Dokumen yang perlu dicari',
  'learn.card.nativeDocs.intro':
    'Dokumen seperti geran tanah, surat hak milik adat dan rekod keluarga membantu proses tuntutan pada masa hadapan.',
  'learn.card.nativeDocs.why':
    'Dokumen yang tersusun menjimatkan masa keluarga dan pihak berkuasa.',
  'learn.card.nativeDocs.tip':
    'Catat lokasi dokumen penting dalam aplikasi ini supaya keluarga tahu di mana untuk bermula.',

  'track.selectTitle': 'Pilih Trek Perundangan',
  'track.selectDesc':
    'Kami hanya bertanya kumpulan agama dan negeri — bukan kaum atau etnik. Trek hanya mempengaruhi kandungan pembelajaran.',
  'track.religionLabel': 'Kumpulan agama',
  'track.stateLabel': 'Negeri',
  'track.statePlaceholder': 'Pilih negeri (pilihan)',
  'track.save': 'Simpan Trek',
  'track.updated': 'Trek dikemas kini. Kandungan pembelajaran telah berubah.',
  'track.stateRequired': 'Untuk trek adat anak negeri, sila pilih Sabah atau Sarawak.',
  'track.current': 'Trek semasa',
  'track.nativeStateHint': 'Negeri wajib untuk trek adat anak negeri.',
  'track.labelMuslim': 'Muslim',
  'track.labelNonMuslim': 'Bukan Muslim',
  'track.labelNative': 'Adat anak negeri (Sabah/Sarawak)',
  'track.labelUnsure': 'Tidak pasti',

  'summary.title': 'Ringkasan Maklumat Keluarga',
  'summary.subtitle': 'Semak dan cetak ringkasan ini untuk rujukan keluarga.',
  'summary.print': 'Cetak / Simpan sebagai PDF',
  'summary.reviewCheckbox': 'Saya telah menyemak ringkasan ini.',
  'summary.back': 'Kembali ke Dashboard',
  'summary.reportTitle': 'Ringkasan Persediaan Keluarga',
  'summary.owner': 'Pemilik',
  'summary.notStated': 'Tidak dinyatakan',
  'summary.generated': 'Dijana pada',
  'summary.assetsHeading': 'Aset',
  'summary.contactsHeading': 'Kontak Keluarga dan Kecemasan',
  'summary.scoreHeading': 'Skor Kesediaan',
  'summary.checklistHeading': 'Senarai Semak',
  'summary.colAsset': 'Aset',
  'summary.colCategory': 'Kategori',
  'summary.colInstitution': 'Institusi',
  'summary.colValue': 'Nilai Anggaran (RM)',
  'summary.colDocLocation': 'Lokasi Dokumen',
  'summary.colName': 'Nama',
  'summary.colRelationship': 'Hubungan',
  'summary.colPhone': 'Telefon',
  'summary.colPrimary': 'Utama',
  'summary.totalLabel': 'Jumlah Nilai Anggaran (Indikatif)',
  'summary.notRecorded': 'Belum Direkodkan',
  'summary.done': 'Selesai',
  'summary.notDone': 'Belum',
  'summary.missingAssets': 'Tiada aset direkodkan.',
  'summary.missingContacts': 'Tiada kontak direkodkan.',
  'summary.emptyPhone': '—',

  'disc.report':
    'Dokumen ini ialah ringkasan maklumat peribadi untuk rujukan keluarga sahaja. Ia bukan dokumen Hibah, Wasiat, sijil Faraid, bukti hak milik atau pengesahan waris. Semua nilai aset adalah anggaran pengguna dan tidak semestinya nilai pusaka yang boleh diagihkan. Semak dengan institusi berkaitan dan penasihat berkelayakan.',
  'disc.trackMuslim':
    'Panduan ini menjelaskan Faraid, Wasiat, Hibah, Waqaf dan penamaan takaful secara umum. Ia bukan nasihat undang-undang, bukan pengesahan hak waris, dan tidak mengira pembahagian pusaka.',
  'disc.trackNonMuslim':
    'Panduan ini merujuk Wills Act 1959 dan Distribution Act 1958 (Semenanjung Malaysia) secara umum. Sabah dan Sarawak mempunyai rejim berasingan. Ia bukan nasihat undang-undang atau pengesahan hak waris.',
  'disc.trackNative':
    'Panduan ini bersifat umum mengenai adat dan undang-undang anak negeri Sabah/Sarawak. Hak dan proses berbeza mengikut negeri, komuniti dan Mahkamah Anak Negeri. Dapatkan nasihat pihak berkuasa tempatan.',
  'disc.trackUnsure':
    'Kami tidak dapat menentukan trek perundangan yang sesuai untuk anda. Panduan di bawah merangkumi lebih daripada satu trek. Sila dapatkan nasihat profesional bertauliah.',

  'notFound.title': 'Halaman tidak ditemui',
  'notFound.desc': 'Alamat yang anda buka tidak wujud dalam aplikasi ini.',
  'notFound.home': 'Kembali ke Dashboard',

  'val.nameRequired': 'Nama diperlukan.',
  'val.nameTooLong': 'Nama terlalu panjang (maksimum {max} aksara).',
  'val.valueRequired': 'Nilai anggaran diperlukan.',
  'val.valueInvalid': 'Masukkan nombor yang sah.',
  'val.valueNegative': 'Nilai tidak boleh negatif.',
  'val.valueTooLarge': 'Nilai terlalu besar.',
  'val.categoryRequired': 'Pilih kategori.',
  'val.relationshipRequired': 'Pilih hubungan.',
  'val.fieldTooLong': 'Maksimum {max} aksara.',
  'val.fixErrors': 'Sila betulkan ralat yang ditanda.',

  'cat.bankSavings': 'Simpanan Bank',
  'cat.property': 'Hartanah',
  'cat.investments': 'Pelaburan (ASB, unit amanah, saham)',
  'cat.epf': 'KWSP',
  'cat.insurance': 'Insurans / Takaful',
  'cat.business': 'Kepentingan Perniagaan',
  'cat.cashGold': 'Tunai, Emas dan Barang Kemas',
  'cat.vehicle': 'Kenderaan',
  'cat.other': 'Lain-lain',

  'rel.Spouse': 'Pasangan',
  'rel.Child': 'Anak',
  'rel.Parent': 'Ibu Bapa',
  'rel.Sibling': 'Adik-beradik',
  'rel.Relative': 'Saudara',
  'rel.Other': 'Lain-lain',

  'aria.closeDialog': 'Tutup dialog',
  'aria.deleteAsset': 'Padam aset {name}',
  'aria.editAsset': 'Edit aset {name}',
  'aria.deleteContact': 'Padam kontak {name}',
  'aria.editContact': 'Edit kontak {name}',
  'aria.openMenu': 'Buka menu',
  'aria.closeMenu': 'Tutup menu',
} as const;

export type DictKey = keyof typeof msDict;

export const enDict: Record<DictKey, string> = {
  'app.name': 'WarisReady',
  'app.tagline': 'Plan Today, Protect Tomorrow.',
  'app.demoBanner': "Demo Mode — Information is stored only in this device's browser.",
  'app.demoNotice':
    "Demo Mode — Information is stored only in this device's browser. Do not enter real banking information or confidential documents.",
  'app.storageNotice':
    'This information is not synchronised or encrypted as an archival record. Data may be lost if the browser or storage is cleared. Use fictional data for the demonstration.',
  'app.ariaMainNav': 'Main navigation',
  'app.ariaMenu': 'Open navigation menu',

  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.close': 'Close',
  'common.edit': 'Edit',
  'common.delete': 'Delete',
  'common.confirm': 'Continue',
  'common.optional': 'Optional',
  'common.dismiss': 'Dismiss',
  'common.storageError': 'Data could not be saved in this browser.',
  'common.required': 'Required',

  'language.label': 'Language',
  'language.switch': 'Switch language',

  'nav.menu': 'Menu',
  'nav.dashboard': 'Dashboard',
  'nav.assets': 'Assets',
  'nav.family': 'Family',
  'nav.readiness': 'Readiness',
  'nav.learn': 'Knowledge Hub',
  'nav.summary': 'Summary',

  'warn.corrupt':
    'Saved data could not be read. The app started with an empty profile and will not overwrite the old data automatically.',
  'warn.normalized': 'Some saved data was invalid and has been corrected automatically.',
  'warn.storage':
    'Browser storage is unavailable. Changes will not persist after the page is reloaded.',

  'demo.load': 'Load Demo Data',
  'demo.reset': 'Clear Data',
  'demo.dialogTitle': 'Load Demo Data',
  'demo.dialogDesc':
    'Choose a demo persona. Loading a persona replaces all current data and keeps the active language.',
  'demo.replaceTitle': 'Replace current data?',
  'demo.replaceConfirm':
    'The current profile contains data. Load this persona and replace all current data?',
  'demo.resetTitle': 'Clear all data?',
  'demo.resetDesc': 'All data in this browser will be deleted. Continue?',
  'demo.loaded': 'Demo data for {name} loaded.',
  'demo.resetDone': 'All data has been cleared.',
  'demo.personaMeta': '{track} · {assets} assets · {contacts} contacts · {score}%',

  'dashboard.welcome': 'Welcome',
  'dashboard.welcomeBrand': 'Welcome to WarisReady',
  'dashboard.question': 'Is your family prepared if an emergency happens?',
  'dashboard.nameLabel': 'Display Name',
  'dashboard.namePlaceholder': 'Your name',
  'dashboard.nameSaved': 'Name saved successfully.',
  'dashboard.metricValue': 'Total Estimated Value',
  'dashboard.metricAssets': 'Number of Assets',
  'dashboard.metricContacts': 'Family Contacts',
  'dashboard.metricScore': 'Readiness Score',
  'dashboard.ctaReadiness': 'Complete Your Preparation',
  'dashboard.ctaSummary': 'View Emergency Summary',
  'dashboard.incomplete': 'Incomplete Tasks',
  'dashboard.recentAssets': 'Recent Assets',
  'dashboard.viewAll': 'View All',
  'dashboard.trackLabel': 'Legal track:',
  'dashboard.trackChange': 'Change',
  'dashboard.trackNote': 'The track affects learning content only, not your score or data.',
  'dashboard.setupTitle': 'Choose your legal track',
  'dashboard.setupDesc':
    'The track helps us show suitable estate guidance. It does not affect your score, assets or contacts.',
  'dashboard.setupSkip': 'Maybe later',
  'dashboard.noIncomplete': 'All tasks are complete.',
  'dashboard.addFirstAsset': 'Add Asset',
  'dashboard.addFirstContact': 'Add Contact',

  'status.complete': 'Checklist Complete',
  'status.almost': 'Almost Complete',
  'status.inProgress': 'In Progress',
  'status.notReady': 'Not Ready Yet',

  'asset.title': 'Know Your Assets',
  'asset.subtitle':
    'Record basic asset information so your family knows where to begin.',
  'asset.totalLabel': 'Total Estimated Value (Indicative)',
  'asset.add': 'Add Asset',
  'asset.addFirst': 'Add Your First Asset',
  'asset.empty': 'No assets recorded yet.',
  'asset.emptyFiltered': 'No assets match your search.',
  'asset.clearFilter': 'Clear Filters',
  'asset.searchPlaceholder': 'Search name or institution',
  'asset.allCategories': 'All Categories',
  'asset.fieldName': 'Asset Name',
  'asset.fieldCategory': 'Category',
  'asset.fieldInstitution': 'Institution / Bank',
  'asset.fieldValue': 'Estimated Value (RM)',
  'asset.fieldDocLocation': 'Document Location',
  'asset.fieldNotes': 'Notes',
  'asset.formAddTitle': 'Add Asset',
  'asset.formEditTitle': 'Edit Asset',
  'asset.saved': 'Asset saved successfully.',
  'asset.deleted': 'Asset deleted successfully.',
  'asset.deleteTitle': 'Delete this asset?',
  'asset.deleteDesc': 'The asset "{name}" will be permanently deleted.',
  'asset.institutionPlaceholder': 'e.g. Demo Bank, ASNB',
  'asset.docLocationPlaceholder': 'e.g. Blue file at home',
  'asset.notesPlaceholder': 'Additional notes (optional)',
  'asset.count': '{count} assets',

  'family.title': 'Loved Ones',
  'family.add': 'Add Contact',
  'family.empty': 'No family contacts recorded yet.',
  'family.primary': 'Primary Contact',
  'family.primaryShort': 'Primary',
  'family.fieldName': 'Name',
  'family.fieldRelationship': 'Relationship',
  'family.fieldPhone': 'Phone Number',
  'family.fieldPrimary': 'Make Primary Emergency Contact',
  'family.formAddTitle': 'Add Contact',
  'family.formEditTitle': 'Edit Contact',
  'family.saved': 'Contact saved successfully.',
  'family.deleted': 'Contact deleted successfully.',
  'family.deleteTitle': 'Delete this contact?',
  'family.deleteDesc': 'The contact "{name}" will be permanently deleted.',
  'family.phonePlaceholder': 'e.g. 012-3456789',
  'family.namePlaceholder': 'Full name',
  'family.count': '{count} contacts',
  'family.disclaimer':
    'This list is for reference and emergency contact only. It is not confirmation of who is legally entitled to inherit.',

  'readiness.title': 'How Prepared Are You?',
  'readiness.completed': '{done} of 5 completed',
  'readiness.autoAssessed': 'Automatically assessed',
  'readiness.manual': 'Manual confirmation',
  'readiness.reviewNote':
    'Confirming means "I have reviewed", not "I own a valid legal document".',
  'readiness.reviewSummary': 'Review Summary',
  'readiness.disclaimer':
    'This score only shows the completeness of your preparation. It is not legal validation of any document or estate arrangement.',
  'readiness.points': '{points} pts',

  'task.assets.label': 'Record at least one asset',
  'task.assets.desc': 'Add your first asset to the inventory.',
  'task.family.label': 'Record at least one family member / contact',
  'task.family.desc': 'Add at least one family member or emergency contact.',
  'task.documents.label': 'I have reviewed the location of important documents',
  'task.documents.desc': 'You have reviewed where important documents are kept.',
  'task.planning.label': 'I have reviewed Hibah, Wasiat or nomination needs',
  'task.planning.desc': 'You have reviewed Hibah, Wasiat or nomination needs.',
  'task.emergency.label': 'I have reviewed the family emergency summary',
  'task.emergency.desc': 'Review the emergency summary, then confirm it on the summary page.',

  'learn.title': 'Estate Knowledge for Everyone',
  'learn.subtitle': 'General guidance based on your legal track.',
  'learn.whyLabel': 'Why it matters',
  'learn.tipLabel': 'Practical tip',
  'learn.officialLink': 'Open official source',
  'learn.generalDisclaimer':
    'This content is for general education only and is not legal advice.',
  'learn.trackHeading': 'Guidance for track: {track}',
  'learn.groupMuslim': 'Muslim track guidance',
  'learn.groupNonMuslim': 'Non-Muslim track guidance',
  'learn.nativeNote':
    'The state of {state} has its own native customary legal regime. If relevant, consider the native customary track.',
  'learn.localLawWarning':
    'The Wills Act 1959 and Distribution Act 1958 apply in Peninsular Malaysia only. Sabah and Sarawak have separate legal regimes.',
  'learn.nativeStatePrompt':
    'The native customary track requires Sabah or Sarawak. Please select your state below.',
  'learn.adviceTitle': 'Seek professional advice',
  'learn.adviceBody':
    'WarisReady is not a legal adviser. For inheritance, will, hibah or customary decisions, consult a lawyer, syariah adviser, Amanah Raya, or the relevant state authority.',
  'learn.bodyFallback': 'Full guidance is available in Bahasa Melayu.',

  'learn.card.faraid.title': 'Faraid',
  'learn.card.faraid.intro':
    'Faraid is the Islamic distribution of an estate in shares set by syariah, after wishes and debts are settled.',
  'learn.card.faraid.why':
    'Understanding the basics helps your family identify who is involved and which documents to prepare, without calculating shares themselves.',
  'learn.card.faraid.tip':
    'List assets, debts and ownership documents in one place so your family can refer to them easily.',

  'learn.card.wasiat.title': 'Wasiat (one-third)',
  'learn.card.wasiat.intro':
    'A Wasiat is an instruction about your property after death; for Muslims, a bequest to non-heirs is generally limited to one-third of the estate.',
  'learn.card.wasiat.why':
    'Knowing this limit prevents family misunderstandings about how much may be bequeathed.',
  'learn.card.wasiat.tip':
    'Consult a qualified syariah adviser before preparing or amending a Wasiat.',

  'learn.card.hibah.title': 'Hibah, Waqaf and Amanah Khairat',
  'learn.card.hibah.intro':
    'Hibah is a gift made during your lifetime, while waqaf and amanah khairat direct benefits towards charitable or family purposes.',
  'learn.card.hibah.why':
    'Each instrument has different conditions and effects, so understand them before deciding.',
  'learn.card.hibah.tip':
    'Keep copies of any hibah or trust deed in a safe place and tell your family where they are kept.',

  'learn.card.takaful.title': 'Takaful and EPF nomination',
  'learn.card.takaful.intro':
    'Takaful and EPF nominations make it easier for your family to claim benefits, but they do not determine inheritance rights under Faraid.',
  'learn.card.takaful.why':
    'An outdated nomination can complicate claims; review it after major family changes.',
  'learn.card.takaful.tip':
    'Review your nomination periodically and keep a copy of the latest statement.',

  'learn.card.wills.title': 'Wills Act 1959',
  'learn.card.wills.intro':
    'In Peninsular Malaysia, the Wills Act 1959 sets out how a valid will is made, including age, signature and witness requirements.',
  'learn.card.wills.why':
    'A valid will helps avoid confusion and delay in administering your estate.',
  'learn.card.wills.tip':
    'Keep the original will in a safe place and inform your executor or a trusted family member.',

  'learn.card.intestacy.title': 'Intestacy: Distribution Act 1958',
  'learn.card.intestacy.intro':
    'If there is no will, the Distribution Act 1958 (Peninsular Malaysia) determines how the estate is distributed among heirs.',
  'learn.card.intestacy.why':
    'Understanding these rules helps your family anticipate the process ahead.',
  'learn.card.intestacy.tip':
    'Keep copies of marriage, birth and family documents somewhere easy to find.',

  'learn.card.probate.title': 'Probate and letters of administration',
  'learn.card.probate.intro':
    'A will requires probate, while an estate without a will requires letters of administration before assets can be distributed.',
  'learn.card.probate.why':
    'Knowing about these documents early reduces delays while your family is grieving.',
  'learn.card.probate.tip':
    'Record institution names and document locations so the application process is faster.',

  'learn.card.epf.title': 'EPF, insurance nomination and trusts',
  'learn.card.epf.intro':
    'EPF and insurance nominations make benefit payments easier, while a trust can help manage assets for beneficiaries.',
  'learn.card.epf.why':
    'Without a nomination or planning, your family may face a longer claims process.',
  'learn.card.epf.tip':
    'Review your nomination and consider professional advice for any trust arrangement.',

  'learn.card.ncr.title': 'NCR land (native customary rights)',
  'learn.card.ncr.intro':
    'Native customary rights (NCR) in Sabah and Sarawak differ from ordinary registered title and depend on state law.',
  'learn.card.ncr.why':
    "Misunderstanding land status can delay your family's affairs.",
  'learn.card.ncr.tip':
    'Confirm the land status with the relevant state land office.',

  'learn.card.nativeCourt.title': 'Native Court',
  'learn.card.nativeCourt.intro':
    'For native communities, the Native Court handles applications for letters of administration for certain estates.',
  'learn.card.nativeCourt.why':
    'Processes and jurisdiction vary between states and communities.',
  'learn.card.nativeCourt.tip':
    'Ask the local district office or Native Court about the first steps.',

  'learn.card.landSuccession.title': 'Land succession in Sabah and Sarawak',
  'learn.card.landSuccession.intro':
    'Land succession processes in Sabah and Sarawak differ between the two states and between communities.',
  'learn.card.landSuccession.why':
    'Each state has its own procedures and forms.',
  'learn.card.landSuccession.tip':
    'Keep the title, land tax receipts and family documents together.',

  'learn.card.nativeDocs.title': 'Documents to locate',
  'learn.card.nativeDocs.intro':
    'Documents such as land titles, customary tenure letters and family records help with future claims.',
  'learn.card.nativeDocs.why':
    'Well-organised documents save time for your family and the authorities.',
  'learn.card.nativeDocs.tip':
    'Record where important documents are kept in this app so your family knows where to start.',

  'track.selectTitle': 'Choose Legal Track',
  'track.selectDesc':
    'We only ask religion group and state — never race or ethnicity. The track affects learning content only.',
  'track.religionLabel': 'Religion group',
  'track.stateLabel': 'State',
  'track.statePlaceholder': 'Select a state (optional)',
  'track.save': 'Save Track',
  'track.updated': 'Track updated. Learning content has changed.',
  'track.stateRequired': 'For the native customary track, please select Sabah or Sarawak.',
  'track.current': 'Current track',
  'track.nativeStateHint': 'State is required for the native customary track.',
  'track.labelMuslim': 'Muslim',
  'track.labelNonMuslim': 'Non-Muslim',
  'track.labelNative': 'Native customary (Sabah/Sarawak)',
  'track.labelUnsure': 'Not sure',

  'summary.title': 'Family Information Summary',
  'summary.subtitle': 'Review and print this summary for your family.',
  'summary.print': 'Print / Save as PDF',
  'summary.reviewCheckbox': 'I have reviewed this summary.',
  'summary.back': 'Back to Dashboard',
  'summary.reportTitle': 'Family Preparation Summary',
  'summary.owner': 'Owner',
  'summary.notStated': 'Not stated',
  'summary.generated': 'Generated on',
  'summary.assetsHeading': 'Assets',
  'summary.contactsHeading': 'Family and Emergency Contacts',
  'summary.scoreHeading': 'Readiness Score',
  'summary.checklistHeading': 'Checklist',
  'summary.colAsset': 'Asset',
  'summary.colCategory': 'Category',
  'summary.colInstitution': 'Institution',
  'summary.colValue': 'Estimated Value (RM)',
  'summary.colDocLocation': 'Document Location',
  'summary.colName': 'Name',
  'summary.colRelationship': 'Relationship',
  'summary.colPhone': 'Phone',
  'summary.colPrimary': 'Primary',
  'summary.totalLabel': 'Total Estimated Value (Indicative)',
  'summary.notRecorded': 'Not Recorded',
  'summary.done': 'Complete',
  'summary.notDone': 'Not yet',
  'summary.missingAssets': 'No assets recorded.',
  'summary.missingContacts': 'No contacts recorded.',
  'summary.emptyPhone': '—',

  'disc.report':
    'This document is a personal information summary for family reference only. It is not a Hibah, Wasiat or will, Faraid certificate, proof of ownership, or confirmation of heirs. All asset values are user estimates and are not necessarily distributable estate values. Check with the relevant institutions and a qualified adviser.',
  'disc.trackMuslim':
    'This guidance explains Faraid, Wasiat, Hibah, Waqaf and takaful nomination in general terms. It is not legal advice, does not confirm heirs, and does not calculate inheritance shares.',
  'disc.trackNonMuslim':
    'This guidance refers generally to the Wills Act 1959 and the Distribution Act 1958 (Peninsular Malaysia). Sabah and Sarawak have separate regimes. It is not legal advice or confirmation of heirs.',
  'disc.trackNative':
    'This guidance is general information about native customary law in Sabah/Sarawak. Rights and process vary by state, community and Native Court. Seek advice from the relevant local authority.',
  'disc.trackUnsure':
    'We cannot determine which legal track applies to you. The guidance below covers more than one track. Please seek advice from a qualified professional.',

  'notFound.title': 'Page not found',
  'notFound.desc': 'The address you opened does not exist in this app.',
  'notFound.home': 'Back to Dashboard',

  'val.nameRequired': 'Name is required.',
  'val.nameTooLong': 'Name is too long (maximum {max} characters).',
  'val.valueRequired': 'Estimated value is required.',
  'val.valueInvalid': 'Enter a valid number.',
  'val.valueNegative': 'Value cannot be negative.',
  'val.valueTooLarge': 'Value is too large.',
  'val.categoryRequired': 'Select a category.',
  'val.relationshipRequired': 'Select a relationship.',
  'val.fieldTooLong': 'Maximum {max} characters.',
  'val.fixErrors': 'Please fix the highlighted errors.',

  'cat.bankSavings': 'Bank Savings',
  'cat.property': 'Property',
  'cat.investments': 'Investments (ASB, unit trust, shares)',
  'cat.epf': 'EPF / KWSP',
  'cat.insurance': 'Insurance / Takaful',
  'cat.business': 'Business Interest',
  'cat.cashGold': 'Cash, Gold and Jewellery',
  'cat.vehicle': 'Vehicle',
  'cat.other': 'Other',

  'rel.Spouse': 'Spouse',
  'rel.Child': 'Child',
  'rel.Parent': 'Parent',
  'rel.Sibling': 'Sibling',
  'rel.Relative': 'Relative',
  'rel.Other': 'Other',

  'aria.closeDialog': 'Close dialog',
  'aria.deleteAsset': 'Delete asset {name}',
  'aria.editAsset': 'Edit asset {name}',
  'aria.deleteContact': 'Delete contact {name}',
  'aria.editContact': 'Edit contact {name}',
  'aria.openMenu': 'Open menu',
  'aria.closeMenu': 'Close menu',
};

export type Translate = (key: DictKey, vars?: Record<string, string | number>) => string;

export function createTranslator(language: Language): Translate {
  const dict = language === 'en' ? enDict : msDict;
  return (key, vars) => {
    const lookup = dict as Partial<Record<DictKey, string>>;
    const fallback = msDict as Partial<Record<DictKey, string>>;
    let value = lookup[key];
    if (value === undefined) {
      if (import.meta.env.DEV) {
        console.warn(`[i18n] Missing ${language} translation for key: ${key}`);
      }
      value = fallback[key] ?? key;
    }
    if (vars) {
      for (const [name, replacement] of Object.entries(vars)) {
        value = value.replaceAll(`{${name}}`, String(replacement));
      }
    }
    return value;
  };
}

export const CATEGORY_KEYS: Record<AssetCategory, DictKey> = {
  'Bank Savings': 'cat.bankSavings',
  Property: 'cat.property',
  'Investments (ASB, unit trust, shares)': 'cat.investments',
  'EPF / KWSP': 'cat.epf',
  'Insurance / Takaful': 'cat.insurance',
  'Business Interest': 'cat.business',
  'Cash, Gold and Jewellery': 'cat.cashGold',
  Vehicle: 'cat.vehicle',
  Other: 'cat.other',
};

export const RELATIONSHIP_KEYS: Record<Relationship, DictKey> = {
  Spouse: 'rel.Spouse',
  Child: 'rel.Child',
  Parent: 'rel.Parent',
  Sibling: 'rel.Sibling',
  Relative: 'rel.Relative',
  Other: 'rel.Other',
};

export const TRACK_LABEL_KEYS: Record<LegalTrack, DictKey> = {
  muslim: 'track.labelMuslim',
  'non-muslim': 'track.labelNonMuslim',
  'native-customary': 'track.labelNative',
  unsure: 'track.labelUnsure',
};

export const TRACK_DISCLAIMER_KEYS: Record<LegalTrack, DictKey> = {
  muslim: 'disc.trackMuslim',
  'non-muslim': 'disc.trackNonMuslim',
  'native-customary': 'disc.trackNative',
  unsure: 'disc.trackUnsure',
};
