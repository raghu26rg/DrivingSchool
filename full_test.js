const API = 'http://localhost:5000/api';
const FRONTEND = 'http://localhost:5173';
let adminToken = '';
let studentToken = '';
const testPhone = `77777${Date.now().toString().slice(-5)}`;
let passed = 0;
let failed = 0;

const test = (name, ok) => {
  if (ok) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.log(`  ❌ ${name}`); }
};

const run = async () => {
  console.log('═══════════════════════════════════════════');
  console.log('  NEHA DRIVING SCHOOL — FULL TEST SUITE');
  console.log('═══════════════════════════════════════════\n');

  // ── 1. Frontend Health ──
  console.log('📦 [1] Frontend Server');
  try {
    const feRes = await fetch(FRONTEND);
    test('Vite serves index.html', feRes.ok);
    const html = await feRes.text();
    test('Page contains React root div', html.includes('id="root"'));
    test('Page title is correct', html.includes('Neha Motor Driving School'));
  } catch (e) { test('Frontend reachable', false); }

  // ── 2. Backend Health ──
  console.log('\n📦 [2] Backend Server');
  try {
    const beRes = await fetch('http://localhost:5000/');
    test('Express responds OK', beRes.ok);
    const text = await beRes.text();
    test('Root message correct', text.includes('Neha Motor Driving School'));
  } catch (e) { test('Backend reachable', false); }

  // ── 3. Admin Login ──
  console.log('\n🔐 [3] Admin Authentication');
  try {
    const res = await fetch(`${API}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '9989195761', password: 'Soumya@123' })
    });
    const data = await res.json();
    adminToken = data.token;
    test('Admin login returns 200', res.ok);
    test('JWT token received', !!adminToken);
    test('Role is admin', data.role === 'admin');
    test('Name is Soumya', data.name === 'Soumya');
  } catch (e) { test('Admin login works', false); }

  // ── 4. Create Student ──
  console.log('\n👤 [4] Student CRUD');
  let studentId = '';
  try {
    const res = await fetch(`${API}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ name: 'Test Student', phone: testPhone, vehicleAssigned: 'Maruti Swift', trainingType: '609d57a414e21a24d8620000' })
    });
    const data = await res.json();
    studentId = data._id;
    test('Create student returns 201', res.status === 201);
    test('Student name matches', data.name === 'Test Student');
    test('Student phone matches', data.phone === testPhone);
    test('Default status is active', data.status === 'active');
    test('Days completed starts at 0', data.daysCompleted === 0);
    test('Total days is 26', data.totalDays === 26);
  } catch (e) { test('Student creation', false); console.log('    Error:', e.message); }

  // ── 5. Get Students List ──
  try {
    const res = await fetch(`${API}/students`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    test('Get students returns array', Array.isArray(data));
    test('Created student in list', data.some(s => s.phone === testPhone));
  } catch (e) { test('Get students', false); }

  // ── 6. Update Student ──
  try {
    const res = await fetch(`${API}/students/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ vehicleAssigned: 'Honda City' })
    });
    const data = await res.json();
    test('Update student returns 200', res.ok);
    test('Vehicle updated', data.vehicleAssigned === 'Honda City');
  } catch (e) { test('Update student', false); }

  // ── 7. Student OTP Flow ──
  console.log('\n📱 [5] Student OTP Authentication');
  try {
    const otpReq = await fetch(`${API}/auth/student/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: testPhone })
    });
    const otpData = await otpReq.json();
    test('OTP request returns 200', otpReq.ok);
    test('Mock OTP is 1234', otpData.mockOtp === '1234');

    const verifyRes = await fetch(`${API}/auth/student/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: testPhone, otp: '1234' })
    });
    const verifyData = await verifyRes.json();
    studentToken = verifyData.token;
    test('OTP verify returns 200', verifyRes.ok);
    test('Student JWT received', !!studentToken);
    test('Student role correct', verifyData.role === 'student');
  } catch (e) { test('OTP flow', false); }

  // ── 8. Wrong OTP rejected ──
  try {
    const badOtp = await fetch(`${API}/auth/student/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: testPhone, otp: '9999' })
    });
    test('Wrong OTP rejected (401)', badOtp.status === 401);
  } catch (e) { test('Wrong OTP rejection', false); }

  // ── 9. Attendance ──
  console.log('\n📋 [6] Attendance System');
  try {
    const markRes = await fetch(`${API}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${studentToken}` },
      body: JSON.stringify({ status: 'present' })
    });
    test('Mark attendance returns 201', markRes.status === 201);

    // Try marking again — should fail
    const dupRes = await fetch(`${API}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${studentToken}` },
      body: JSON.stringify({ status: 'present' })
    });
    test('Duplicate attendance blocked (400)', dupRes.status === 400);

    // Get attendance records
    const getRes = await fetch(`${API}/attendance`, {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    const records = await getRes.json();
    test('Get attendance returns array', Array.isArray(records));
    test('Has at least 1 record', records.length >= 1);
  } catch (e) { test('Attendance system', false); }

  // ── 10. Dashboard Stats ──
  console.log('\n📊 [7] Admin Dashboard');
  try {
    const res = await fetch(`${API}/dashboard`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    test('Dashboard returns 200', res.ok);
    test('Has totalStudents field', typeof data.totalStudents === 'number');
    test('Has activeStudents field', typeof data.activeStudents === 'number');
    test('Has todayAttendance field', typeof data.todayAttendance === 'number');
    test('Total students >= 1', data.totalStudents >= 1);
  } catch (e) { test('Dashboard stats', false); }

  // ── 11. Auth Protection ──
  console.log('\n🔒 [8] Route Protection');
  try {
    const noAuth = await fetch(`${API}/students`);
    test('Students route blocked without token', !noAuth.ok);

    const noAuth2 = await fetch(`${API}/dashboard`);
    test('Dashboard route blocked without token', !noAuth2.ok);
  } catch (e) { test('Route protection', false); }

  // ── 12. Cleanup — Delete test student ──
  console.log('\n🧹 [9] Cleanup');
  try {
    const delRes = await fetch(`${API}/students/${studentId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    test('Delete student returns 200', delRes.ok);
  } catch (e) { test('Cleanup', false); }

  // ── Summary ──
  console.log('\n═══════════════════════════════════════════');
  console.log(`  RESULTS: ${passed} passed, ${failed} failed, ${passed + failed} total`);
  console.log('═══════════════════════════════════════════');
  if (failed === 0) {
    console.log('  🎉 ALL TESTS PASSED!');
  } else {
    console.log('  ⚠️  Some tests failed — review above.');
  }
  console.log('');
};

run();
