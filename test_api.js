async function testAPI() {
  try {
    // Login as admin
    const loginRes = await fetch('http://localhost:5000/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '9390912974', password: 'admin' })
    });
    const loginData = await loginRes.json();
    if (!loginData.token) throw new Error('Login failed: ' + JSON.stringify(loginData));
    const token = loginData.token;
    console.log('Admin logged in');

    // Get students
    const studentsRes = await fetch('http://localhost:5000/api/students', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const studentsData = await studentsRes.json();
    const students = studentsData.filter(s => s.role === 'student');
    console.log('Students count:', students.length);
    if (students.length === 0) return console.log('No students found');
    
    const student = students[0];
    console.log(`Testing with student ${student.name} (ID: ${student._id})`);
    console.log(`Current paymentMethod: ${student.paymentMethod}`);

    // Update payment method to 'upi'
    console.log('Sending PUT to update payment method to upi...');
    const putRes = await fetch(`http://localhost:5000/api/students/${student._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        paymentMethod: 'upi',
        totalFee: 5000,
        paidAmount: 2000
      })
    });
    const putData = await putRes.json();
    console.log('PUT Response paymentMethod:', putData.paymentMethod);

    // Get student again
    const finalGet = await fetch('http://localhost:5000/api/students', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const finalData = await finalGet.json();
    const finalStudent = finalData.find(s => s._id === student._id);
    console.log('Final GET paymentMethod:', finalStudent.paymentMethod);

  } catch (error) {
    console.error('API Error:', error.message);
  }
}

testAPI();
