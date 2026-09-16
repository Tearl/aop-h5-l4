export default {

  data() {
    return {
      maturityOptions: [
        {
          abtiCode: '0.5',
          abtiName: '0.5'
        },
        {
          abtiCode: '0.6',
          abtiName: '0.6'
        },
        {
          abtiCode: '0.7',
          abtiName: '0.7'
        },
        {
          abtiCode: '0.8',
          abtiName: '0.8'
        },
        {
          abtiCode: '0.9',
          abtiName: '0.9'
        },
        {
          abtiCode: '1.0',
          abtiName: '1.0'
        }
      ],
      functionOverallOptions: [
        {
          abtiCode: '00',
          abtiName: '待分配'
        },
        {
          abtiCode: '01',
          abtiName: '设计中'
        },
        {
          abtiCode: '03',
          abtiName: '待一确'
        },
        {
          abtiCode: '04',
          abtiName: '待二确'
        },
        {
          abtiCode: '05',
          abtiName: '待登记'
        },
        {
          abtiCode: '11',
          abtiName: '登记中'
        },
        {
          abtiCode: '12',
          abtiName: '已登记'
        },
        {
          abtiCode: '13',
          abtiName: '已驳回'
        }
      ],
      
      functionServiceOptions: [
        {
          abtiCode: '02',
          abtiName: '待验收'
        },
        {
          abtiCode: '01',
          abtiName: '设计中'
        },
        {
          abtiCode: '03',
          abtiName: '已完成'
        },
        {
          abtiCode: '11',
          abtiName: '登记中'
        },
        {
          abtiCode: '12',
          abtiName: '已登记'
        },
        {
          abtiCode: '13',
          abtiName: '已驳回'
        }
      ]
    }
  }
}