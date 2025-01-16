class TimeAdapter {
  convert(time) {
    if (! time) {
      return '-'
    }
    return time.toString().slice(0, 10)
  }

  humanable(time) {
    if (! time) {
      return '-'
    }
    return (new Date(time)).toLocaleString()
  }

  getAge(birthDate) {
    if (! birthDate) {
      return '-'
    }
    return Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10)
  }
}

export default new TimeAdapter();