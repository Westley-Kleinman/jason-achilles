<?php
// Legacy WordPress bootstrap replaced on deploy — send / to the React SPA.
header('Location: /index.html', true, 301);
exit;
